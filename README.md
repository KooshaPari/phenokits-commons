<!-- AI-DD-META:START -->
<!-- This repository is planned, maintained, and managed by AI Agents only. -->
<!-- Slop issues are expected and intentionally present as part of an HITL-less -->
<!-- /minimized AI-DD metaproject of learning, refining, and building brute-force -->
<!-- training for both agents and the human operator. -->
![Downloads](https://img.shields.io/github/downloads/KooshaPari/phenokits-commons/total?style=flat-square&label=downloads&color=blue)
![GitHub release](https://img.shields.io/github/v/release/KooshaPari/phenokits-commons?style=flat-square&label=release)
![License](https://img.shields.io/github/license/KooshaPari/phenokits-commons?style=flat-square)
![AI-Slop](https://img.shields.io/badge/AI--DD-Slop%20Expected-orange?style=flat-square)
![AI-Only-Maintained](https://img.shields.io/badge/Planned%20%26%20Maintained%20by-AI%20Agents%20Only-red?style=flat-square)
![HITL-less](https://img.shields.io/badge/HITL--less%20AI--DD-metaproject-yellow?style=flat-square)

> ⚠️ **AI-Agent-Only Repository**
>
> This repo is **planned, maintained, and managed exclusively by AI Agents**.
> Slop issues, rough edges, and AI artifacts are **expected and intentionally
> present** as part of an **HITL-less / minimized AI-DD** metaproject focused
> on learning, refining, and brute-force training both the agents and the
> human operator. Bug reports and contributions are still welcome, but please
> expect AI-generated code, comments, and documentation throughout.
<!-- AI-DD-META:END -->
> **Work state:** ACTIVE · **Progress:** `████████░░ 80%`
> Consolidated Python SDK (6 kits); de-nested pheno-kits; next: publish to PyPI per ADR-011. · updated 2026-06-02

# phenotype-python-sdk

Monorepo of Phenotype org Python (and polyglot) SDK kits, consolidated from standalone kit repositories.

## Workspace kits

| Kit | Path | Role |
|-----|------|------|
| **mcp-kit** | `packages/mcp-kit` | Model Context Protocol tooling (Python, Rust, Go) |
| **testing-kit** | `packages/testing-kit` | QA, quality CLI, analysis, and test harnesses |
| **auth-kit** | `packages/auth-kit` | Authentication and security helpers |
| **resilience-kit** | `packages/resilience-kit` | Deploy, CI/CD, and resilience utilities |

### Python sub-projects (under kits)

- `packages/testing-kit/python/` — `qa-kit`, `pheno-testing-cli`, `pheno-quality-tools`, `pheno-quality-cli`, `pheno-analysis-cli`, `mcp-qa`
- `packages/resilience-kit/python/` — `deploy-kit`, `ci-cd-kit`, `pheno-deploy`

See each package’s `README.md` and `pyproject.toml` for install and usage.

## Development

Root `pyproject.toml` documents the workspace layout. Per-package tooling may use Poetry, setuptools, or Hatch — follow the kit you are changing.

```bash
cd packages/<kit>/python   # when applicable
# use that package's documented install (poetry install, pip install -e ., etc.)
```

## License

MIT — see [LICENSE](LICENSE).
# phenotype-go-sdk

Phenotype-org Go SDK — consolidates Go Kit/SDK packages from the KooshaPari org.

## Packages

| Path | Source | Description |
|------|--------|-------------|
| \packages/devhex\ | [DevHex](https://github.com/KooshaPari/DevHex) | Hexagonal Go library for dev environment abstractions (module `github.com/KooshaPari/devenv-abstraction`). The single canonical Go module in the workspace. |
| \packages/platformkit\ | [PlatformKit](https://github.com/KooshaPari/PlatformKit) | Docs/specs only. Its Go code (`go/devenv`, `go/devhex`) was a broken duplicate of `devhex` and was removed (see Workspace notes). |
| \packages/mcpkit\ | [McpKit](https://github.com/KooshaPari/McpKit) | MCP framework SDK (Go workspace) — deferred (see notes). |

Use `go work sync` from the repo root to build across packages.

## Workspace notes

- `go.work` includes only `packages/devhex` — it builds and tests clean and is
  the single source of the devenv/devhex modules.
- The two duplicate copies under `packages/platformkit/go/` were **removed**
  (2026-06-02, ADR-011 Go convergence): `platformkit/go/devhex` was a
  byte-divergent dup of `packages/devhex` claiming the same module path, and
  `platformkit/go/devenv` was an older lowercase-path copy that did not compile.
- `packages/mcpkit/go/go.work` references missing `pheno-mcp-*` modules — Go MCP
  packages deferred until restored.
> **Pinned references (Phenotype-org)**
> - MSRV: see rust-toolchain.toml
> - cargo-deny config: see deny.toml
> - cargo-audit: rustsec/audit-check@v2 weekly
> - Branch protection: 1 reviewer required, no force-push
> - Authority: phenotype-org-governance/SUPERSEDED.md

# PhenoUtils

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![FR Coverage](https://github.com/KooshaPari/phenoUtils/actions/workflows/fr-coverage.yml/badge.svg)](https://github.com/KooshaPari/phenoUtils/actions/workflows/fr-coverage.yml)
[![Rust](https://img.shields.io/badge/rust-1.75%2B-orange.svg)](https://www.rust-lang.org)

Essential utilities and foundational crates for the Phenotype ecosystem. Provides CLI shells, filesystem abstractions, cryptographic operations, network utilities, and testing helpers used across all Phenotype services and tools.

## Overview

**PhenoUtils** is the foundational utilities library for the Phenotype platform, providing battle-tested implementations of common patterns: interactive shells, filesystem abstractions with async support, cryptographic operations, network utilities, and comprehensive testing helpers. All crates are zero-dependency where possible, thoroughly tested, and designed for high-performance, production use.

**Core Mission**: Eliminate utility boilerplate across Phenotype services by providing reusable, well-tested foundational crates that handle complexity transparently.

## Technology Stack

- **Language**: Rust (edition 2021)
- **Async Runtime**: Tokio for async filesystem and network operations
- **Cryptography**: ring for cryptographic primitives, argon2 for password hashing
- **Testing**: criterion for benchmarking, proptest for property testing
- **Build**: Cargo workspace with shared dependency versions

## Key Features

- **CLI Shell Framework**: Interactive shell builder with command parsing, completions, history
- **Filesystem Utilities**: Async file I/O, recursive operations, atomic writes, path utilities
- **Cryptographic Operations**: Hashing, encryption, signing, HMAC, key derivation
- **Network Utilities**: TCP/UDP helpers, connection pooling, DNS resolution, TLS support
- **Testing Helpers**: Fixtures, temporary files/directories, mock implementations, property generators
- **Error Handling**: Rich error types with context, automatic `?` operator support
- **Performance**: Zero-copy where possible, memory pooling, efficient string handling

## Quick Start

```bash
# Clone and explore
git clone <repo-url>
cd phenoUtils

# Review governance and architecture
cat CLAUDE.md          # Project governance
cat AGENTS.md          # Agent operating contract

# Build all crates
cargo build --workspace

# Run comprehensive test suite
cargo test --workspace

# Run benchmarks
cargo bench --workspace

# Lint and format
cargo clippy --workspace -- -D warnings
cargo fmt --check

# Explore crate examples
ls -la crates/
```

## Project Structure

```
phenoUtils/
├── crates/
│   ├── pheno-shell/            # Interactive CLI shell framework
│   │   ├── src/
│   │   │   ├── shell.rs        # Shell builder and REPL
│   │   │   ├── parser.rs       # Command parsing
│   │   │   ├── completions.rs  # Tab completion engine
│   │   │   └── history.rs      # Command history management
│   │   └── examples/
│   ├── pheno-fs/               # Async filesystem abstractions
│   │   ├── src/
│   │   │   ├── file.rs         # Async file operations
│   │   │   ├── dir.rs          # Directory traversal
│   │   │   ├── atomic.rs       # Atomic write semantics
│   │   │   └── permissions.rs  # Fine-grained access control
│   │   └── tests/
│   ├── pheno-crypto/           # Cryptographic operations
│   │   ├── src/
│   │   │   ├── hash.rs         # Hashing (SHA-256, BLAKE3)
│   │   │   ├── encrypt.rs      # Symmetric encryption (AES-256)
│   │   │   ├── sign.rs         # Digital signatures (Ed25519)
│   │   │   ├── kdf.rs          # Key derivation (Argon2)
│   │   │   └── hmac.rs         # Message authentication
│   │   └── benches/
│   ├── pheno-net/              # Network utilities
│   │   ├── src/
│   │   │   ├── tcp.rs          # TCP connection helpers
│   │   │   ├── udp.rs          # UDP utilities
│   │   │   ├── pool.rs         # Connection pooling
│   │   │   ├── dns.rs          # DNS resolution
│   │   │   └── tls.rs          # TLS configuration
│   │   └── tests/
│   ├── pheno-testing/          # Testing utilities
│   │   ├── src/
│   │   │   ├── fixtures.rs     # Test fixture builders
│   │   │   ├── tempdir.rs      # Temporary directories
│   │   │   ├── mocks.rs        # Mock implementations
│   │   │   └── generators.rs   # Property test generators
│   │   └── tests/
│   └── Cargo.toml              # Workspace manifest
├── docs/
│   ├── ARCHITECTURE.md         # Design and patterns
│   ├── CRATE_GUIDE.md          # Per-crate usage guide
│   └── BENCHMARKS.md           # Performance characteristics
├── benches/
│   ├── crypto_perf.rs
│   ├── fs_perf.rs
│   └── network_perf.rs
└── Cargo.toml                  # Root workspace config
```

## Crate Reference

| Crate | Purpose | Stability |
|-------|---------|-----------|
| **pheno-shell** | Interactive CLI shell builder | Stable |
| **pheno-fs** | Async filesystem abstractions | Stable |
| **pheno-crypto** | Cryptographic operations | Stable |
| **pheno-net** | Network utilities and pooling | Stable |
| **pheno-testing** | Testing helpers and mocks | Stable |

## Related Phenotype Projects

- **PhenoLibs**: Shared data structures and algorithms
- **phenotype-tooling**: CLI tools built on pheno-shell
- **Tracera**: Observability (uses pheno-net for metrics export)
- **phenotype-ops-mcp**: MCP server (uses pheno-crypto for token management)

## License

MIT — see [LICENSE](./LICENSE).
# phenotype-infra

[![Build](https://img.shields.io/github/actions/workflow/status/KooshaPari/phenotype-infra/quality-gate.yml?branch=main&label=build)](https://github.com/KooshaPari/phenotype-infra/actions)
[![Release](https://img.shields.io/github/v/release/KooshaPari/phenotype-infra?include_prereleases&sort=semver)](https://github.com/KooshaPari/phenotype-infra/releases)
[![License](https://img.shields.io/github/license/KooshaPari/phenotype-infra)](LICENSE)
[![Phenotype](https://img.shields.io/badge/Phenotype-org-blueviolet)](https://github.com/KooshaPari)
[![AI Slop Inside](https://sladge.net/badge.svg)](https://sladge.net)


Canonical home for Phenotype-org infrastructure-as-code, architectural decision records (ADRs), specifications, and operational runbooks. Supports the **7-node hybrid compute mesh** spanning Oracle Cloud, GCP, AWS, Cloudflare, and a Tailscale-attached home desktop.

## Overview

`phenotype-infra` is the single source of truth for:

- **Network topology** — Tailscale-based control plane across 7 nodes (OCI primary/secondary, GCP e2-micro, AWS Lambda webhooks, Cloudflare Workers/Tunnel, home Mac runner, and a Hetzner spillover reserved for Phase 2).
- **Runner routing** — Forgejo + Woodpecker CI with label-based dispatch (`[self-hosted, heavy, home]` vs `[self-hosted, oci]`).
- **Credential management** — Vaultwarden as canonical credential store, rotation policy documented in `docs/governance/security-policy.md`.
- **Rollback kill-switch** — Every node has a documented path back to GitHub Actions / disable procedure.

## Quick-start

```bash
# 1. Clone + read the topology
git clone git@github.com:KooshaPari/phenotype-infra.git
cd phenotype-infra
cat docs/specs/compute-mesh-spec.md

# 2. Read the top ADRs in order
ls docs/adr/

# 3. Bring up OCI primary (Day-1)
cat docs/runbooks/day1-oci-first-light.md

# 4. Register home-desktop runner (Day-1)
cat docs/runbooks/day1-home-runner-setup.md
```

## Operational status (2026-04-24)

- **Windows desktop heavy runner** — operational. Service `actions.runner.KooshaPari-phenotype-tooling.desktop-kooshapari-desk` registered and idle on the home Mac. Install procedure (with the gotchas that surfaced live: em-dash → ASCII, alphanumeric password, 48-char Description cap, unquoted `-OrgUrl`) is captured in `docs/runbooks/windows-desktop-runner.md`. Parsec coexistence verified: runner service stays in `Manual` start, only triggered on dispatch.
- Credential for the local `runneruser` account is stored in Vaultwarden under `windows-runner/desktop-kooshapari-desk/runneruser`.
- See `docs/runbooks/windows-desktop-runner.md` for verification, tear-down, and replacement steps.

## Top ADRs

| ADR | Title |
|-----|-------|
| [0001](docs/adr/0001-hybrid-compute-mesh.md) | Hybrid Compute Mesh (7 nodes) |
| [0002](docs/adr/0002-oci-primary-backbone.md) | OCI Ampere as primary backbone |
| [0003](docs/adr/0003-home-desktop-as-heavy-runner.md) | Home desktop as heavy runner |
| [0004](docs/adr/0004-tailscale-as-control-plane.md) | Tailscale as control plane |
| [0005](docs/adr/0005-forgejo-woodpecker-vs-gitea-vs-gh-actions.md) | Forgejo + Woodpecker vs alternatives |
| [0006](docs/adr/0006-vaultwarden-as-canonical-cred-store.md) | Vaultwarden canonical credential store |
| [0007](docs/adr/0007-runner-label-routing.md) | Runner label routing taxonomy |
| [0008](docs/adr/0008-parsec-gaming-mode-pause.md) | Parsec gaming mode pause |
| [0009](docs/adr/0009-hw-mesh-agent-bus.md) | HW mesh agent bus (Phase 2) |

See also: the parent compute-mesh playbook lives at `../docs/governance/compute_mesh.md` (sibling `repos/docs/governance/` directory).

## Contribution rules

- **No secrets.** Every credential is a placeholder (`<OCI_TENANCY_OCID>`, `<TAILSCALE_AUTHKEY>`, etc.). Real values live in Vaultwarden and are injected at runtime.
- **Terraform apply is human-only.** Agents may `terraform plan` and open PRs; `apply` requires explicit user approval.
- **ADR-first.** Any topology change needs an ADR before the IaC change.
- **Runbook-first.** Any node addition needs a runbook before the IaC scaffold.
- **Scripting hierarchy** (per `~/.claude/CLAUDE.md`): Rust default; Zig/Mojo/Go with one-line justification; Bash only as ≤5-line glue with justification comment. Terraform/Ansible/YAML are exempt as domain tools.

## Repository layout

```
docs/adr/             Architectural decisions (immutable once accepted)
docs/specs/           Topology, routing, credential inventory, rollback specs
docs/runbooks/        Step-by-step operational procedures
docs/governance/      Security, cost, incident-response policies
iac/                  Operational crates index — see iac/README.md
iac/oci-lottery/      A1.Flex capacity-lottery daemon (Rust)
iac/oci-post-acquire/ Post-acquire hook orchestrator
iac/tailscale/        Tailscale ACL + ephemeral keygen (Rust)
iac/landing-bootstrap/ Per-node landing-page generator (Rust)
iac/terraform/        Per-provider Terraform modules (stubs)
iac/ansible/          Configuration management playbooks
iac/scripts/          Bootstrap helpers (bash ≤5-line or Rust)
configs/              Per-service .example config files
.github/workflows/    CI (terraform plan, ansible-lint, docs check)
```

For the operational-crates entry index (oci-lottery, oci-post-acquire,
tailscale-keygen, landing-bootstrap), see [`iac/README.md`](iac/README.md).

## License

Dual-licensed under MIT **OR** Apache-2.0 at your option. See `LICENSE-MIT` and `LICENSE-APACHE`.
# Agent DevOps Setups

**STATUS: DEPRECATED — see DEPRECATION.md**

[![AI Slop Inside](https://sladge.net/badge.svg)](https://sladge.net)

This repo is the shared configuration fabric for multi-model agent tooling in the Phenotype
organization: policy federation, harness-specific overlays, task-domain scopes, and extension
runtime hooks for `Codex`, `Cursor-agent`, `Claude`, and `Factory-Droid`.

This repository is superseded by **phenoShared** and is maintained as read-only reference. No new development.

## Problem this solves

Current agent-level toolchains each support their own local override surfaces (`AGENTS.md`,
`CLAUDE.md`, `Cursor` rules, harness flags, etc.), which leads to drift.
This repository unifies those concerns by:

- Defining precedence-aware policy layers,
- Normalizing extension configuration across harnesses,
- Recording all decisions and merges in auditable artifacts.

## Directory layout

```text
agent-devops-setups/
├── policies/
│   ├── system/         # platform / org-wide defaults
│   ├── user/           # user/operator-level overrides
│   ├── harness/        # Codex / Cursor / Claude / Factory-Droid
│   ├── repo/           # per-repo behavior
│   ├── task-domain/    # per-domain behavior (agentops/ci/devops/...)
│   └── extensions/     # optional capability layers
├── extensions/
│   ├── manifests/      # cataloged extension packages
│   └── hooks/          # helper hook templates and docs
├── schemas/            # JSON schemas for policy and extensions
├── tools/
│   ├── federate_policy.py # resolves merged effective policy
│   └── sync_policy.sh     # write generated payload into repos
├── docs/               # audit notes and architecture docs
└── .github/workflows/  # optional validation/refresh automation
```

## Policy resolution model

Default layer order (low → high precedence):

1. `system` (org-wide defaults)
2. `user` (operator role overrides)
3. `harness` (tooling-specific behavior)
4. `repo` (repository-specific controls)
5. `task-domain` (domain-specific contracts)
6. `extensions` (explicitly selected extension packs)

Higher layers override keys from lower layers.

## Usage

```bash
# Build effective policy for a specific context
python tools/federate_policy.py \
  --repo agent-devops-setups \
  --harness codex \
  --user core-operator \
  --task-domain agentops \
  --extensions codex-gate,agentops-ci \
  --out /tmp/effective-policy.json

# Apply a policy payload into the repository path for local tooling
bash tools/sync_policy.sh \
  --repo-root /Users/kooshapari/CodeProjects/Phenotype/repos/thegent \
  --payload /tmp/effective-policy.json \
  --mode write

# Batch onboarding
bash tools/onboard_repos.sh \
  --harness codex \
  --task-domain agentops \
  --extensions codex-gate,agentops-ci \
  --user core-operator \
  --repo-list thegent,template-commons,portage,heliosCLI,cliproxyapi++,agentapi-plusplus

# Matrix onboarding (harness + task-domain)
bash tools/matrix_onboard.sh \
  --harnesses "codex,cursor-agent,claude,factory-droid" \
  --task-domains "agentops,devops" \
  --repo-list thegent,template-commons,portage,heliosCLI,cliproxyapi++,agentapi-plusplus

# Make targets
make help
make policy-sync        # codex + agentops full list
make policy-matrix      # matrix across harnesses and domains
make policy-matrix-dry  # same matrix in dry-run mode
```

## Expected outputs

- `effective_policy`: merged JSON object with all active policy keys.
- `applied_layers`: exact list of layer files used.
- `audit`: deterministic trace for forensics and review.

## Governance goals

- No silent precedence changes.
- No hidden defaults for critical controls.
- Full traceability from base policy to final resolved policy.
- Additive extension system that can be disabled by removing an extension manifest.

## Related tooling

- `AGENTS.md` and `CLAUDE.md` generation for repo surfaces.
- Harness hook policy (`extensions/hooks`).
- CI policy validation and PR gate gating via `.github/workflows`.

## Shared DevOps Helpers

Repository-level automation scripts live in `scripts/` and are consumed by
Phenotype repos that need consistent publish/checker behavior.

- `scripts/repo-push-fallback.sh`:
  publish helper with a primary remote first and local/remote fallback.
- `scripts/repo-devops-checker.sh`:
  lightweight DevOps gate checks for git health and optional `task ci` execution.

Recommended invocation pattern from a repo checkout:

```bash
# Optional override if repo layout differs from ../agent-devops-setups
export PHENOTYPE_DEVOPS_REPO_ROOT=/absolute/path/to/agent-devops-setups

# Optional per-command overrides
export PHENOTYPE_DEVOPS_PUSH_HELPER=$PHENOTYPE_DEVOPS_REPO_ROOT/scripts/repo-push-fallback.sh
export PHENOTYPE_DEVOPS_CHECKER_HELPER=$PHENOTYPE_DEVOPS_REPO_ROOT/scripts/repo-devops-checker.sh

bash /absolute/path/to/your/repo/scripts/push-heliosapp-with-fallback.sh
bash /absolute/path/to/your/repo/scripts/devops-checker.sh --check-ci --emit-summary
```

Because each repo may wire flags and defaults differently, keep a small local
wrapper script that forwards into these shared scripts with repo-local defaults.

## Validation commands

```bash
# Validate generated policy payload against schemas
python tools/validate_policy_payload.py \
  --payload /tmp/effective-policy.json \
  --policy-schema schemas/policy-resolution.schema.json \
  --manifest-schema schemas/extension-manifest.schema.json \
  --manifest-dir extensions/manifests \
  --strict
```

## Signing and rotation audit

```bash
# Emit signed policy payload
python tools/federate_policy.py \
  --repo thegent \
  --harness codex \
  --user core-operator \
  --task-domain agentops \
  --extensions codex-gate \
  --sign-key "$AGENT_POLICY_HMAC_KEY" \
  --out /tmp/effective-policy.json

# Verify signed payload
python tools/validate_policy_payload.py \
  --payload /tmp/effective-policy.json \
  --sign-key "$AGENT_POLICY_HMAC_KEY" \
  --strict

# Track rotation across repos
python tools/audit_policy_rotation.py \
  --repo-list thegent,template-commons,heliosCLI \
  --repo-root /Users/kooshapari/CodeProjects/Phenotype/repos \
  --state /tmp/policy-rotation-state.json \
  --out /tmp/policy-rotation-report.json

# Build PR package
python tools/build_pr_package.py
```
# phenotype-dep-guard

Malicious dependency analysis and supply chain security guard.

## Layer Contract

- layer_type: security_ops
- layer_name: phenotype-dep-guard
- versioning: semver

## Mission

Analyze direct and transitive dependencies for malicious code, vulnerabilities, and anomalous behavior.

1. High-velocity multi-source dependency resolution.
2. Heuristic and static triage (AST parsing, .pth/setup.py scanning).
3. Agentic LLM deep analysis (minimax-m2.7-highspeed, gpt-5-mini).
4. Reporting and alerting.

## Spec Kitty Workflow

```bash
spec-kitty research --feature layered-template-platform --force
```

Primary feature workspace:

- `kitty-specs/layered-template-platform/`

## Operational Workflow

1. Run `task check` before release.
2. Keep manifest/reconcile files aligned for any contract-affecting change.
3. Run `task release:prep` as final pre-release gate.

## Outputs

- Layer contract specs
- WP DAG and execution lanes
- Reconcile contract and acceptance criteria
# phenotype-org-audits

Central inventory and metrics hub for the Phenotype organization. Comprehensive audit-history tracking across **165 unique repositories** (48 local + 94 GitHub-only + 23 local-only), with quarterly refresh baseline and systemic-issue governance.

## Purpose

This repository serves as the canonical archive for:
- **Authoritative inventory** — 165-repo master registry (GitHub + local)
- **Quarterly audits** — Organization-wide scans (LOC, dependencies, complexity, governance adoption)
- **Systemic issues** — Cross-repo duplication, build failures, policy gaps, archived-code salvage opportunities
- **Governance velocity** — Adoption rate of CLAUDE.md, AGENTS.md, AgilePlus integration, test coverage
- **Longitudinal trends** — Drift in LOC, tech stack changes, architectural decisions
- **Coverage metrics** — Test coverage, spec traceability, quality gate compliance

## Structure

```
inventory/                                 # Authoritative repo catalog
├── AUTHORITATIVE_REPO_INVENTORY.md         # 165-repo master registry (GitHub + local)
├── github_remote_inventory.md              # GitHub API snapshot
└── deleted_traces.md                       # Archive salvage candidates (29 archived repos)

metrics/                                   # Quarterly performance baselines
├── COVERAGE_V3.md                          # Test coverage snapshot
├── UPLIFT_REPORT.md                        # Quality improvements over time
└── SYSTEMIC_ISSUES.md                      # Cross-org duplication, gaps, recommendations

audits/<YYYY-MM-DD>/                       # Timestamped audit snapshots
├── INDEX.md                                # Master index for the audit
├── STATUS_AT_<date>.md                     # Complete repo status
├── SYSTEMIC_ISSUES.md                      # Cross-org duplication, governance gaps
├── full_dep_matrix.md                      # Dependency alignment snapshot
├── fr_scaffolding.md                       # Functional requirement traceability
├── governance_adoption.md                  # CLAUDE.md, AGENTS.md, AgilePlus coverage
└── <repo-name>.md                          # Per-repo summary

tooling/
├── aggregator/                             # Audit collection scripts (symlink to phenotype-tooling)
├── inventory-refresh.sh                    # Re-run authoritative inventory agent
└── worklog-aggregator.sh                   # Cross-repo worklog aggregation

CHANGELOG.md                                # Release history with audit entries
```

## Repository Inventory

**TOTAL REPOS TRACKED**: 165 unique repositories

| Category | Count | Details |
|----------|-------|---------|
| Local + GitHub (cloned) | 48 | Active + archived mix |
| GitHub only (not cloned) | 94 | Can be fetched on-demand |
| Local only (no remote) | 12 | Self-contained worktrees |
| Archived on GitHub | 63 | Frozen; salvage candidates mapped |

**Status by Location**:
- ✅ Local + GitHub: 48 repos (primary development)
- 🔗 GitHub only: 94 repos (integrated, not cloned)
- 📦 Local only: 12 repos (internal tools)
- 🗃️ Archived: 63 repos (frozen, 29 have salvage candidates in `inventory/deleted_traces.md`)

See `inventory/AUTHORITATIVE_REPO_INVENTORY.md` for full registry.

## Quarterly Audit Schedule

Audits run automatically via GitHub Actions CI on:
- **Q1**: 1st January, 9am ET
- **Q2**: 1st April, 9am ET
- **Q3**: 1st July, 9am ET
- **Q4**: 1st October, 9am ET

**Cron**: `0 14 1 1,4,7,10 *`

**Refresh Policy**:
- Inventory refreshed: Before each quarterly audit + ad-hoc when new repos detected
- Metrics updated: Each audit run
- Use `tooling/inventory-refresh.sh` to re-run authoritative scan

## Retention Policy

- **Current quarter**: Full detail (all artifacts preserved)
- **Past 4 quarters**: Summary only (INDEX.md + SYSTEMIC_ISSUES.md)
- **Older than 1 year**: Archived to `.archive/` (monthly pruning)

## Metrics Reference

Where to find each metric:

| Metric | Location | Updated | Purpose |
|--------|----------|---------|---------|
| Test coverage | `metrics/COVERAGE_V3.md` | Quarterly | Track coverage baseline across 165 repos |
| Systemic issues | `metrics/SYSTEMIC_ISSUES.md` | Quarterly | Cross-org patterns, gaps, policy violations |
| Quality uplift | `metrics/UPLIFT_REPORT.md` | Quarterly | Improvement trends (LOC reduction, complexity) |
| Dependency alignment | `audits/<YYYY-MM-DD>/full_dep_matrix.md` | Each audit | Version alignment gaps, security advisories |
| Governance adoption | `audits/<YYYY-MM-DD>/governance_adoption.md` | Each audit | CLAUDE.md, AGENTS.md, AgilePlus coverage % |
| FR traceability | `audits/<YYYY-MM-DD>/fr_scaffolding.md` | Each audit | Test-first compliance, spec coverage |

## Governance Integration

- **AgilePlus**: Systemic issues feed `eco-NNN` specs; governance gaps inform policy updates
- **Worklogs**: Cross-project duplication findings → `worklogs/DUPLICATION.md`
- **Test scaffolding**: FR traceability → test-first mandate validation
- **Dependency waves**: Version alignment snapshots → quarterly version-bump waves
- **Archived repos**: Salvage candidates (`inventory/deleted_traces.md`) → extraction planning

## Refresh Inventory (Agent-Driven)

To re-run the authoritative inventory scan:

```bash
cd /Users/kooshapari/CodeProjects/Phenotype/repos/phenotype-org-audits
./tooling/inventory-refresh.sh
```

This triggers the inventory agent to rescan GitHub + local repos and update:
- `inventory/AUTHORITATIVE_REPO_INVENTORY.md`
- `inventory/github_remote_inventory.md`

## Related

- **Worklog aggregation**: `/Users/kooshapari/CodeProjects/Phenotype/repos/worklogs/`
- **Aggregator tooling**: `/Users/kooshapari/CodeProjects/Phenotype/repos/phenotype-tooling/`
- **Organization docs**: `/Users/kooshapari/CodeProjects/Phenotype/repos/docs/governance/`

## License

MIT — see [LICENSE](./LICENSE).
> **Pinned references (Phenotype-org)**
> - MSRV: see rust-toolchain.toml
> - cargo-deny config: see deny.toml
> - cargo-audit: rustsec/audit-check@v2 weekly
> - Branch protection: 1 reviewer required, no force-push
> - Authority: phenotype-org-governance/SUPERSEDED.md

# phenotype-bus

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/KooshaPari/phenotype-bus/ci.yml?branch=main)](https://github.com/KooshaPari/phenotype-bus/actions)
[![Rust](https://img.shields.io/badge/rust-1.75%2B-orange?logo=rust)](https://www.rust-lang.org/)
[![AI Slop Inside](https://sladge.net/badge.svg)](https://sladge.net)

Generic, async pub/sub event bus for cross-collection communication in Phenotype.

## Overview

`phenotype-bus` provides a strongly-typed, tokio-based event bus that enables loose coupling between Phenotype named collections:

- **Sidekick** — agent dispatch & messaging
- **Eidolon** — device automation (desktop, mobile, sandbox)
- **Observably** — distributed tracing & logging
- **Stashly** — state, events, caching
- **Paginary** — pagination & pagination metadata

## Usage

```rust
use phenotype_bus::{Bus, Event};
use serde::Serialize;

#[derive(Clone, Serialize)]
struct UserStatusChanged {
    user_id: String,
    online: bool,
}

impl Event for UserStatusChanged {
    fn event_name(&self) -> &'static str {
        "UserStatusChanged"
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let bus = Bus::new(100);
    let mut rx = bus.subscribe();

    let publisher = {
        let bus = bus.clone();
        tokio::spawn(async move {
            let event = UserStatusChanged {
                user_id: "user-123".into(),
                online: true,
            };

            bus.publish(event).await
        })
    };

    let event = rx.recv().await?;
    println!("Received: {}", event.event_name());

    publisher.await??;

    Ok(())
}
```

## API

### `Bus<E: Event>`

- **`new(capacity: usize)`** - Create a new bus with the specified broadcast channel capacity
- **`publish(event: E) -> Result<(), BusError>`** - Publish an event to all current subscribers
- **`subscribe() -> broadcast::Receiver<Arc<E>>`** - Subscribe to the event stream
- **`receiver_count() -> usize`** - Return the current broadcast receiver count

### `Event` Trait

Implement `Event` for any type that is `Send + Sync + 'static + Serialize`:

```rust
impl Event for MyEvent {
    fn event_name(&self) -> &'static str {
        "MyEvent"
    }
}
```

## Implementation

- **155 LOC** (lib.rs + tests)
- **12 tests** (3 unit + 7 cross-collection integration + 2 smoke)
- **Async first**: built on `tokio::sync::broadcast`
- **Type-safe**: Generic trait bounds enforce compile-time correctness
- **Zero dependencies** beyond standard Phenotype stack (tokio, serde, thiserror)
- **Clone-safe**: `Bus<E>` is cheaply cloneable via `Arc`

## Behavior

### Back-Pressure

The bus is backed by `tokio::sync::broadcast`. That means each subscriber has its own cursor into a bounded ring buffer.

- Slow subscribers can fall behind if the buffer fills.
- When that happens, `broadcast::Receiver::recv()` returns `Err(tokio::sync::broadcast::error::RecvError::Lagged(_))`.
- This is intentional: lag is surfaced to the caller instead of being hidden.

### Publish Before Subscribe

Events are not persisted. If you call `publish()` before any subscriber exists, the event is dropped and will not be replayed to future subscribers.

- Late subscribers only see events published after they subscribe.
- If you need history or replay, use a different transport or add persistence on top of `phenotype-bus`.

## Cross-Collection Integration

Each collection can emit and subscribe to events by adding a dependency on `phenotype-bus`:

```toml
[dependencies]
phenotype-bus = { path = "../../phenotype-bus" }
```

Events are identified by type, so no event registry is needed. Collections are loosely coupled:

- **Sidekick** publishes `DispatchEvent` → **Eidolon** subscribes
- **Observably** publishes `TraceEvent` → **Stashly** subscribes for event sourcing
- **Paginary** publishes `PaginationEvent` → **Observably** logs for tracing

## Project Structure

```
phenotype-bus/
├── Cargo.toml                    # Rust crate metadata
├── src/
│   ├── lib.rs                   # Bus implementation + Event trait
│   ├── bus.rs                   # Bus orchestration
│   ├── error.rs                 # Error types (BusError)
│   └── event.rs                 # Event trait definition
├── tests/
│   ├── integration_tests.rs     # Multi-subscriber scenarios
│   └── fixtures/
├── examples/
│   ├── basic.rs                 # Simple pub/sub example
│   └── multi_topic.rs           # Multi-topic routing
├── docs/
│   ├── ARCHITECTURE.md          # Design overview
│   └── USAGE_PATTERNS.md        # Common patterns
├── CLAUDE.md                     # Development guidelines
└── README.md                     # This file
```

## Technology Stack

- **Language**: Rust (Edition 2021)
- **Async Runtime**: Tokio (broadcast channels)
- **Serialization**: Serde (JSON, bincode)
- **Error Handling**: thiserror with custom `BusError` type
- **Testing**: Inline unit tests + integration tests

## Key Design Decisions

- **Broadcast Channels**: Uses Tokio's built-in broadcast for efficient one-to-many delivery
- **Type-Safe Events**: Generic `Bus<E: Event>` enforces compile-time type safety
- **No Registry**: Event routing is implicit via Rust type system (no string-based registry)
- **Zero-Copy on Arc**: Events are wrapped in `Arc<E>` for efficient sharing
- **Minimal Dependencies**: Only Tokio, Serde, and Thiserror as external deps
- **Clone-friendly**: Bus itself is cheaply cloneable for spawning tasks

## Performance Characteristics

| Metric | Specification |
|--------|---------------|
| **Publish latency** | <1μs per subscriber (broadcast channel backed) |
| **Memory overhead** | ~32 bytes per active subscriber |
| **Throughput** | Depends on Event size; tested with 100+ subscribers |
| **Channel capacity** | Configurable; default 100 events buffered |

## Related Phenotype Projects

- **Sidekick** — Agent dispatch system; uses phenotype-bus for event routing
- **Eidolon** — Device automation; publishes automation events to bus
- **Observably** — Tracing platform; subscribes to event stream for instrumentation
- **Stashly** — State/event caching; uses event sourcing with bus
- **Paginary** — Pagination metadata; publishes pagination events

## Quick Examples

### Publish & Subscribe

```rust
use phenotype_bus::{Bus, Event};
use serde::Serialize;

#[derive(Clone, Serialize)]
struct AppStarted {
    version: String,
}

impl Event for AppStarted {
    fn event_name(&self) -> &'static str {
        "AppStarted"
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let bus = Bus::new(100);
    let mut rx = bus.subscribe();

    bus.publish(AppStarted {
        version: "1.0".into(),
    })
    .await?;

    let event = rx.recv().await?;
    println!("Subscriber got: {}", event.event_name());

    Ok(())
}
```

### Multiple Event Types

```rust
use phenotype_bus::Event;
use serde::Serialize;

#[derive(Clone, Serialize)]
struct AppStarted {
    version: String,
}

#[derive(Clone, Serialize)]
struct AppShutdown {
    reason: String,
}

#[derive(Clone, Serialize)]
enum SystemEvent {
    Startup(AppStarted),
    Shutdown(AppShutdown),
}

impl Event for SystemEvent {
    fn event_name(&self) -> &'static str {
        match self {
            SystemEvent::Startup(_) => "Startup",
            SystemEvent::Shutdown(_) => "Shutdown",
        }
    }
}
```

## License

Apache-2.0

## Running Tests

Run the workspace test suite from the repository root:

```bash
cargo test --workspace
```

For this crate, the current suite covers unit tests, edge cases for back-pressure and publish-before-subscribe behavior, and cross-collection integration tests.
> **`phenokits-commons` — provenance (2026-06-02)**
> This repository is the proper home for the Phenotype org's cross-cutting commons
> (governance templates, hexagon ADRs, shared go/typescript libs, configs, schemas,
> policies). It was **extracted out of `phenotype-python-sdk`**, where this umbrella
> tree had been wrongly nested under `packages/pheno-kits/` — a Python SDK package
> must not embed a Rust workspace + org-governance monorepo. See **ADR-006** in
> [`KooshaPari/PhenoSpecs`](https://github.com/KooshaPari/PhenoSpecs) for the SDK Kit
> taxonomy decision that motivated the split.
>
> - The 7 genuine Python SDK packages that lived here (`pheno-cli-builder`,
>   `pheno-cli-kit`, `phenotype-id`, `phenotype-logging`, `phenotype-py-kit`,
>   `phenotype-testing`, `phenotype-config`) now live in `phenotype-python-sdk`
>   and are intentionally **not** duplicated here.
> - Canonical org index of all repos/artifacts: **`phenotype-registry`**.
> - The hexagon/ ADRs are also cross-referenced from PhenoSpecs (canonical ADR home).

> **Pinned references (Phenotype-org)**
> - MSRV: see rust-toolchain.toml
> - cargo-deny config: see deny.toml
> - cargo-audit: rustsec/audit-check@v2 weekly
> - Branch protection: 1 reviewer required, no force-push
> - Authority: AGENTS.md

# PhenoKits

**The Phenotype org's umbrella checkout and shared-artifact monorepo.**

## What is this?

PhenoKits plays two related roles, which is the source of common confusion:

1. **Umbrella checkout (parent directory).** When you clone the full Phenotype workspace, `PhenoKits/` is the parent directory that holds ~30 sibling repos (AgilePlus, heliosApp, thegent, Civis, bifrost, etc.) as subdirectories so cross-cutting agents and humans can do org-wide work in one tree. In that role, PhenoKits is **not a project** — it is the workspace root.
2. **Shared-artifact monorepo (this repository).** Independently, `KooshaPari/PhenoKits` is a real git repo containing 12 categories of shared, cross-org artifacts (templates, configs, libs, governance, security, etc.) that every Phenotype project consumes.

In addition, **`HexaKit/`** inside this repo is a **sub-monorepo** included as a git submodule — a separate template/registry workspace, not a sibling subdir.

If you only see this single repo in isolation, you are looking at role (2): the shared-artifact monorepo. The umbrella role (1) only exists when this repo is checked out alongside the rest of the Phenotype org.

## Overview

PhenoKits-the-monorepo organizes artifacts into 12 distinct categories, each with clear mutability rules and agent interaction patterns.

## Categories

| # | Category | Purpose | Mutability |
|---|----------|---------|------------|
| 1 | [`templates/`](templates/) | Scaffolding for new projects | Editable |
| 2 | [`configs/`](configs/) | Parameterized configs | Parameters only |
| 3 | [`libs/`](libs/) | Multi-language libraries | Import/extend |
| 4 | [`secrets/`](secrets/) | Secret management patterns | Locked |
| 5 | [`governance/`](governance/) | ADRs, RFCs, standards | Varies |
| 6 | [`security/`](security/) | Scanning, policies, hardening | Locked |
| 7 | [`observability/`](observability/) | Logging, metrics, tracing | Configurable |
| 8 | [`docs/`](docs/) | API docs, runbooks, guides | Editable |
| 9 | [`scripts/`](scripts/) | Build, release, quality scripts | Executable |
| 10 | [`schemas/`](schemas/) | Type definitions, API specs | Locked |
| 11 | [`policies/`](policies/) | OPA, GitHub, compliance | Enforced |
| 12 | [`credentials/`](credentials/) | Auth configs, patterns | Locked |

## Bundled Kits

These are the buildable / structured kits available inside or alongside this repo.

| Kit | Location | Type | Notes |
|-----|----------|------|-------|
| HexaKit | [`HexaKit/`](HexaKit/) | **Sub-monorepo (git submodule)** | Hexagonal-architecture template CLI + registry. Has its own Cargo workspace; build from inside `HexaKit/`. |
| Civis | [`KooshaPari/Civis`](https://github.com/KooshaPari/Civis) | Sibling repo | Deterministic simulation and policy-driven architecture workspace. Cloned as a sibling at the umbrella level, not embedded here. |
| Hexagon | [`hexagon/`](hexagon/) | In-repo directory | Hexagonal artifacts curated alongside the kits. |

> Removed from prior docs: `PhenoLibs` row — that kit does not exist in this repo. Use [`libs/`](libs/) for multi-language library artifacts instead.

## Quick Reference

### Agent Interaction Matrix

| Category | Agent Observes | Agent Mutates | Agent Validates |
|----------|----------------|---------------|-----------------|
| Templates | Yes | Instantiated outputs only | No |
| Configs | Yes | Parameters only | Yes (validation) |
| Libs | Yes | No, except generated wrappers | No |
| Secrets | References and metadata only | No | Yes (scanning) |
| Governance | Yes | Yes (ADRs) | No |
| Security | Yes | Yes | Yes (scanning) |
| Observability | Yes | Yes (configs/dashboards) | Yes (monitoring) |
| Docs | Yes | Yes | No |
| Scripts | Yes | Yes | No |
| Schemas | Yes | Yes (code gen) | Yes (type checking) |
| Policies | Yes | Yes | Yes (OPA, gates) |
| Credentials | Broker state only | No | Yes (rotation/expiry checks) |

This matrix describes permission boundaries, not broad technical capability.
Agents should never read or write raw secret or credential material; they may
reference vault handles, metadata, rotation status, and validation results.

## Directory Structure

```
PhenoKits/
├── HexaKit/             # Sub-monorepo (git submodule) — template CLI + registry
├── templates/           # 1. Scaffolding
│   ├── hexagonal/       # Hexagonal architecture templates
│   ├── clean-rust/      # Clean architecture Rust template
│   └── phenotype-api/   # Phenotype API template
├── configs/             # 2. Parameterized configs
├── libs/                # 3. Libraries (rust/python/typescript/go)
├── secrets/             # 4. Secret management
├── governance/          # 5. ADRs, RFCs, standards
├── security/            # 6. Security configs
├── observability/       # 7. Logging, metrics
├── docs/                # 8. Documentation
├── scripts/             # 9. Automation scripts
├── schemas/             # 10. Type definitions
├── policies/            # 11. Enforcement policies
├── credentials/         # 12. Auth configs
└── hexagon/             # Curated hexagonal artifacts
```

## Quick Start

### Clone with the HexaKit sub-monorepo

```bash
git clone --recurse-submodules https://github.com/KooshaPari/PhenoKits.git
cd PhenoKits
# If you forgot --recurse-submodules:
git submodule update --init --recursive
```

### Build the HexaKit sub-monorepo

The repo root's `Cargo.toml` declares `members = []` (it intentionally excludes
`HexaKit/` and the language-specific `libs/*` workspaces). To build buildable
Rust code, enter the relevant sub-workspace:

```bash
# Build HexaKit (sub-monorepo Cargo workspace)
cd HexaKit && cargo build

# Or build the Rust libs sub-workspace
cd libs/rust && cargo build
```

### For Agents

```bash
# Read agent patterns
cat docs/AGENT_PATTERNS.md

# Apply a config
python3 scripts/utility/parameterize.py \
    configs/params.example.json \
    configs/cicd/github-actions/ci.yml
```

### For Developers

```bash
# Apply org configs
cp -r configs/tooling/pre-commit/* .git/hooks/

# Set up CI
cp configs/cicd/github-actions/* .github/workflows/

# Configure observability
cp configs/observability/prometheus.yml ./
```

## Related

- [RESTRUCTURING_PLAN.md](docs/RESTRUCTURING_PLAN.md) — Full restructuring plan
- [RESTRUCTURING_ADR.md](docs/RESTRUCTURING_ADR.md) — Decision record
- [AGENT_PATTERNS.md](docs/AGENT_PATTERNS.md) — Agent consumption patterns
- [HexaKit/](HexaKit/) — Template CLI and registry (sub-monorepo)
- [PhenoKit](https://github.com/KooshaPari/PhenoKit) — Core SDK
- [PhenoSpecs](https://github.com/KooshaPari/PhenoSpecs) — Specifications
- [Civis](https://github.com/KooshaPari/Civis) — Sibling governance/simulation workspace
