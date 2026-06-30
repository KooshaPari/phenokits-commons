"""Tests for CI/CD security posture.

Verifies that:
- All GitHub Actions workflow files use SHA-pinned action versions (L10)
- Template code follows concurrency-safety patterns (L7)
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest
import yaml


# From the audit (L10): all config/CI workflow files must SHA-pin actions
WORKFLOW_DIR = Path(__file__).parent.parent / "configs" / "cicd" / "github-actions" / "workflows"

EXPECTED_WORKFLOWS = [
    "ci.yml",
    "release-template.yml",
    "release.yml",
    "reusable-python-ci.yml",
    "reusable-rust-ci.yml",
    "security.yml",
]

# SHA-1 pattern (40 hex chars) for pinned action versions
SHA1_PATTERN = re.compile(r"^[0-9a-f]{40}$")


def _find_uses_values(data, path=""):
    """Recursively find all `uses` values in a parsed workflow YAML."""
    if isinstance(data, dict):
        for key, value in data.items():
            current = f"{path}.{key}" if path else key
            if key == "uses":
                yield value
            elif isinstance(value, (dict, list)):
                yield from _find_uses_values(value, current)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            yield from _find_uses_values(item, f"{path}[{i}]")


def _find_runs_on(data, path=""):
    """Recursively find all `runs-on` values in a parsed workflow YAML."""
    if isinstance(data, dict):
        for key, value in data.items():
            current = f"{path}.{key}" if path else key
            if key == "runs-on":
                yield value
            elif isinstance(value, (dict, list)):
                yield from _find_runs_on(value, current)
    elif isinstance(data, list):
        for i, item in enumerate(data):
            yield from _find_runs_on(item, f"{path}[{i}]")


class TestWorkflowShaPins:
    """Verify all GitHub Actions workflow files use SHA-pinned actions (L10)."""

    @pytest.mark.parametrize("filename", EXPECTED_WORKFLOWS)
    def test_workflow_file_exists(self, filename: str) -> None:
        """Verify each expected workflow file exists."""
        path = WORKFLOW_DIR / filename
        assert path.exists(), f"Workflow file not found: {path}"

    @pytest.mark.parametrize("filename", EXPECTED_WORKFLOWS)
    def test_actions_sha_pinned(self, filename: str) -> None:
        """Verify every `uses:` reference is SHA-pinned with version comment."""
        path = WORKFLOW_DIR / filename
        assert path.exists(), f"Workflow file not found: {path}"

        content = path.read_text()
        data = yaml.safe_load(content)
        assert isinstance(data, dict), f"{filename}: not a valid YAML dictionary"

        for uses in _find_uses_values(data):
            # Skip non-action references (docker://, local/, etc.)
            if "://" in uses or "/" not in uses:
                continue

            # Must be `owner/repo@SHA` or `owner/repo@SHA # version`
            parts = uses.split("@")
            assert len(parts) == 2, (
                f"{filename}: malformed `uses` value: {uses!r}. "
                "Expected format: `owner/repo@SHA`"
            )

            sha_or_ref = parts[1].split()[0]  # take before any comment
            assert SHA1_PATTERN.match(sha_or_ref), (
                f"{filename}: action {uses!r} is not SHA-pinned. "
                f"Found tag/branch ref {sha_or_ref!r} instead of a 40-char commit SHA. "
                "All actions must be pinned by SHA digest with a version comment."
            )

    @pytest.mark.parametrize("filename", EXPECTED_WORKFLOWS)
    def test_actions_have_version_comment(self, filename: str) -> None:
        """Verify every SHA-pinned action has a `# vX.Y` version comment.

        YAML strips inline comments when parsed, so we check the raw content.
        """
        path = WORKFLOW_DIR / filename
        assert path.exists(), f"Workflow file not found: {path}"

        content = path.read_text()
        for line in content.splitlines():
            stripped = line.strip()
            if not stripped.startswith("uses:"):
                continue
            # Each `uses:` line must include both a `@` (with SHA) and `#` (with version)
            if "://" in stripped or "/" not in stripped:
                continue
            parts = stripped.split("#")
            assert len(parts) >= 2, (
                f"{filename}: line {line!r} is missing a version comment. "
                "Add ` # vX.Y.Z` after the SHA to document which version is pinned."
            )
            comment = parts[-1].strip()
            assert len(comment) > 0, (
                f"{filename}: line {line!r} has an empty version comment. "
                "Add a version reference like ` # v4` after the SHA."
            )

    @pytest.mark.parametrize("filename", EXPECTED_WORKFLOWS)
    def test_no_ubuntu_latest(self, filename: str) -> None:
        """Verify no job uses `ubuntu-latest` runner."""
        path = WORKFLOW_DIR / filename
        assert path.exists(), f"Workflow file not found: {path}"

        content = path.read_text()
        data = yaml.safe_load(content)
        assert isinstance(data, dict), f"{filename}: not a valid YAML dictionary"

        for runs_on in _find_runs_on(data):
            if isinstance(runs_on, str):
                assert "latest" not in runs_on, (
                    f"{filename}: found `runs-on: {runs_on}` which uses 'latest' tag. "
                    "Use a fixed runner version (e.g., ubuntu-24.04)."
                )


class TestConcurrencySafety:
    """Verify concurrency-safety patterns in template code (L7)."""

    TS_EVENT_BUS_PATH = Path(__file__).parent.parent / "templates" / "hexagonal" / \
        "hexagonal-typescript" / "src" / "adapters" / "outbound" / "index.ts"

    def test_event_bus_has_mutex_class(self) -> None:
        """Verify the TS event bus defines a Mutex class for concurrency control."""
        path = self.TS_EVENT_BUS_PATH
        assert path.exists(), f"Event bus file not found: {path}"

        content = path.read_text()
        assert "class Mutex" in content, (
            "InMemoryEventBus is missing the Mutex class. "
            "A Mutex is required to serialize access to the shared handler map."
        )

    def test_event_bus_uses_mutex_in_subscribe(self) -> None:
        """Verify subscribe() uses the mutex to protect handler array mutation."""
        path = self.TS_EVENT_BUS_PATH
        content = path.read_text()

        assert "await this.mutex.run" in content, (
            "InMemoryEventBus.subscribe() does not use a mutex. "
            "Handler array mutation must be serialized to prevent race conditions."
        )

    def test_event_bus_snapshots_handlers_in_publish(self) -> None:
        """Verify publish() snapshots the handler list before iteration."""
        path = self.TS_EVENT_BUS_PATH
        content = path.read_text()

        assert ".slice()" in content, (
            "InMemoryEventBus.publish() does not snapshot handlers. "
            "Use `.slice()` to freeze the handler list before async iteration."
        )

    def test_event_bus_serializes_publish_batch(self) -> None:
        """Verify publishBatch() serializes publishes instead of Promise.all."""
        path = self.TS_EVENT_BUS_PATH
        content = path.read_text()

        assert "Promise.all" not in content.split("publishBatch")[1].split("\n")[0:15], (
            "InMemoryEventBus.publishBatch() should not use Promise.all. "
            "Concurrent publishes to the same event type can interleave handler access."
        )
