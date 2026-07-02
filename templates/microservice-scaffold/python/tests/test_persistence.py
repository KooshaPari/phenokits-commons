"""Tests for persistence adapter - verifies SQL injection fix.

The `list()` method previously used f-string interpolation for SQL
parameters (LIMIT/OFFSET), which is a SQL injection vulnerability pattern.
After the fix, it uses SQLAlchemy ``text()`` with bound parameters.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from src.infrastructure.adapters.persistence import PostgresRepository


class TestPostgresRepository:
    """Tests for PostgresRepository with focus on SQL safety."""

    @pytest.fixture
    def mock_session(self) -> MagicMock:
        """Create a mock async SQLAlchemy session."""
        session = AsyncMock(spec_set=["execute", "get", "add", "commit", "rollback", "delete"])
        # Make execute return a mock result with fetchall
        result_mock = MagicMock()
        result_mock.fetchall.return_value = []
        session.execute.return_value = result_mock
        return session

    @pytest.fixture
    def repo(self, mock_session: MagicMock) -> PostgresRepository:
        """Create a PostgresRepository with mocked session."""
        return PostgresRepository(session=mock_session)

    async def test_list_uses_text_with_bound_params(self, repo: PostgresRepository, mock_session: MagicMock) -> None:
        """Verify that list() passes bound params to session.execute, not raw f-string.

        This is the core security fix: parameters must be passed as query
        bind variables, not interpolated into the SQL string.
        """
        # Act
        result = await repo.list(page=2, page_size=10)

        # Assert - verify execute was called with text() + params dict
        call_args = mock_session.execute.call_args
        assert call_args is not None, "session.execute was not called"

        call_pos_args = call_args[0]
        assert len(call_pos_args) >= 1

        # First positional arg should be a text() callable (not checking exact type
        # to avoid import complexity, but verifying it's not a plain string)
        query_arg = call_pos_args[0]
        query_str = str(query_arg)
        assert ":limit" in query_str or ":offset" in query_str, (
            f"Query should use named bind parameters, got: {query_str}"
        )

        # Second positional arg (or keyword arg) should be the params dict
        if len(call_pos_args) >= 2:
            params = call_pos_args[1]
        elif "params" in call_args[1]:
            params = call_args[1]["params"]
        else:
            params = call_args[1]

        assert isinstance(params, dict), f"Params should be a dict, got {type(params)}"
        assert params.get("limit") == 10, f"Expected limit=10, got {params}"
        assert params.get("offset") == 10, f"Expected offset=10 (page=2, page_size=10), got {params}"

    async def test_list_default_params(self, repo: PostgresRepository, mock_session: MagicMock) -> None:
        """Verify default pagination params are passed correctly."""
        # Act
        result = await repo.list()

        # Assert
        call_args = mock_session.execute.call_args
        assert call_args is not None

        # Check params
        if len(call_args[0]) >= 2:
            params = call_args[0][1]
        else:
            params = call_args[1]

        assert params.get("limit") == 20, f"Expected default limit=20, got {params}"
        assert params.get("offset") == 0, f"Expected default offset=0, got {params}"

    async def test_list_returns_entities(self, repo: PostgresRepository, mock_session: MagicMock) -> None:
        """Verify list() returns Entity objects from query results."""
        # Arrange
        result_mock = mock_session.execute.return_value
        result_mock.fetchall.return_value = [
            MagicMock(spec_set=["_fields"]) for _ in range(3)
        ]
        for i, row in enumerate(result_mock.fetchall.return_value):
            row.__getitem__.side_effect = lambda idx, val=i: (
                "00000000-0000-0000-0000-00000000000" + str(val),
                None,
                None,
            )[idx]

        # Act
        # We need to mock the Entity constructor for this test
        with patch("src.infrastructure.adapters.persistence.Entity") as mock_entity:
            mock_entity.side_effect = lambda id, created_at, updated_at: MagicMock(
                id=id, created_at=created_at, updated_at=updated_at
            )
            result = await repo.list()

        # Assert
        assert mock_entity.call_count == 3

    async def test_list_first_page(self, repo: PostgresRepository, mock_session: MagicMock) -> None:
        """Verify first page params are correct (page=1, offset=0)."""
        # Act
        result = await repo.list(page=1, page_size=50)

        # Assert
        call_args = mock_session.execute.call_args
        if len(call_args[0]) >= 2:
            params = call_args[0][1]
        else:
            params = call_args[1]

        assert params.get("limit") == 50
        assert params.get("offset") == 0
