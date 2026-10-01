# Elsewhere Studio Agent Entry Point

## Repository authority

- GitHub state and checked-in repository files are authoritative.
- `main` is production/released state.
- `develop` is integration state and must contain current `main` history before ordinary implementation begins.
- Issues are the canonical backlog and pull requests are the canonical implementation/review record.
- Product-specific architecture, media rules, render rules, visual acceptance, and publishing decisions belong in this repository.

## Engineering Platform pin

This repository consumes:

- repository: `JonCunninghamDev/engineering-platform`
- release: `v1.0.0`
- commit: `b107c9306161b395cbcaffebb55e47850b999560`
- profile: `node-python`

Do not silently follow unreleased platform branch state. Platform upgrades must be explicit, tested, reviewable, and reversible.

## Startup reads

For ordinary engineering work:

1. Read `README.md`.
2. Read this `AGENTS.md`.
3. Read `engineering-policy.json`.
4. Read `docs/branching.md`.
5. Read the active issue and related product/architecture documentation.
6. Inspect current pull requests, CI, reviews, and partially completed work before creating a new branch.

## Branch invariants

- Never implement directly on `main` or `develop`.
- Temporary implementation branches start from current `develop`.
- Allowed temporary prefixes are `feature/`, `fix/`, and `agent/`.
- Ordinary pull requests target `develop`.
- Only `develop` may be promoted to `main`.
- `develop -> main` is a production release boundary and requires full CI plus explicit human approval.
- There is no direct-to-`main` hotfix route. Urgent fixes still integrate through `develop`.
- After production promotion, synchronize `main` back into `develop` when histories differ.
- Delete temporary branches after merge. Never force-push a shared branch.

## Product gates

Engineering tests are evidence, not a substitute for media acceptance. As the product develops, generated scene quality, loop continuity, audio quality, visual novelty, publishing readiness, credentials, destructive operations, and public release decisions may require additional repository-local gates.

## Human approval boundaries

Human approval is required for:

- production release to `main`;
- credential or secret authority;
- destructive operations or migrations;
- backward-incompatible public contracts;
- changes that materially alter publishing authority or automated publication behavior;
- any explicit visual/content acceptance gate configured by the product.
