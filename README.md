# Elsewhere Studio

A lightweight generative media studio for creating, micro-animating, quality-checking, rendering, and publishing ambient visual scenes.

## Delivery model

Elsewhere Studio uses two long-lived branches:

- `main` is production and released source of truth.
- `develop` is the integration branch and is kept current with `main`.
- `feature/*`, `fix/*`, and `agent/*` are temporary branches created from current `develop`.

Normal delivery:

```text
develop -> feature/*|fix/*|agent/* -> PR + CI -> develop
```

Production promotion:

```text
develop -> PR + full CI + human approval -> main -> sync back to develop
```

Direct implementation on `main` or `develop` is not permitted. There is no separate direct-to-`main` hotfix route.

## Engineering Platform

This repository consumes `JonCunninghamDev/engineering-platform` release `v1.0.0`, pinned to:

`b107c9306161b395cbcaffebb55e47850b999560`

The shared platform governs reusable engineering mechanics. Product architecture, render behavior, media quality gates, visual decisions, and publishing policy remain local to Elsewhere Studio.

See `AGENTS.md`, `engineering-policy.json`, and `docs/branching.md`.
