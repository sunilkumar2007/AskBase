"""AskBase AI Backend - Authentication via Supabase JWT.

Validates Supabase-issued JWT tokens from the frontend.
Never implements custom password hashing — Supabase Auth owns identity.

Flow:
  Frontend → Authorization: Bearer <supabase_access_token>
  Backend → Verify JWT signature via Supabase JWKS
  Backend → Extract user_id / claims
  Backend → Authorize against project / resource
"""
from __future__ import annotations

import logging
from typing import Any

import httpx
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError

from app.config import settings

logger = logging.getLogger("askbase")

# ── Supabase JWKS cache ───────────────────────────────────────────────────────
_jwks_cache: dict[str, Any] = {}
_jwks_url: str | None = None


def _get_jwks_url() -> str | None:
    global _jwks_url
    if _jwks_url is None and settings.SUPABASE_URL:
        _jwks_url = f"{settings.SUPABASE_URL.rstrip('/')}/.well-known/jwks.json"
    return _jwks_url


async def _fetch_jwks() -> dict[str, Any]:
    """Fetch Supabase JWKS and return as {kid: key} mapping."""
    url = _get_jwks_url()
    if not url:
        raise RuntimeError("SUPABASE_URL not configured.")
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        keys = resp.json().get("keys", [])
        return {k["kid"]: k for k in keys}


async def _get_jwks() -> dict[str, Any]:
    """Cached JWKS — fetch once and reuse until process restart."""
    global _jwks_cache
    if not _jwks_cache:
        _jwks_cache = await _fetch_jwks()
    return _jwks_cache


async def verify_supabase_token(token: str) -> dict[str, Any] | None:
    """Verify a Supabase JWT and return claims dict, or None if invalid.

    Raises:
        Nothing — returns None on any failure so callers can respond with 401.
    """
    if not token:
        return None
    try:
        # Strip "Bearer " prefix if present
        if token.lower().startswith("bearer "):
            token = token[7:]

        jwks = await _get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        if kid not in jwks:
            logger.warning("JWT kid not found in JWKS.")
            return None

        claims = jwt.decode(
            token,
            jwks[kid],
            algorithms=["HS256", "RS256"],
            options={"verify_aud": False},  # Supabase tokens use 'aud' = 'authenticated'
        )
        return claims

    except ExpiredSignatureError:
        logger.warning("Expired JWT token.")
        return None
    except JWTError as exc:
        logger.warning("Invalid JWT token: %s", exc)
        return None
    except Exception:
        logger.exception("Unexpected error verifying JWT.")
        return None


def extract_user_id(claims: dict[str, Any]) -> str | None:
    """Extract the Supabase user UUID from JWT claims."""
    return claims.get("sub")


def has_role(claims: dict[str, Any], role: str) -> bool:
    """Check whether the JWT claims contain the given role."""
    user_metadata = claims.get("user_metadata") or {}
    app_metadata = claims.get("app_metadata") or {}
    roles: list[str] = []
    for meta in (user_metadata, app_metadata):
        r = meta.get("role") or meta.get("roles")
        if isinstance(r, str):
            roles.append(r)
        elif isinstance(r, list):
            roles.extend(r)
    return role in roles
