# Branching and Delivery

Elsewhere Studio uses exactly two long-lived branches.

## main

`main` is production/released source of truth.

- Do not implement directly on `main`.
- Production reaches `main` only from `develop` through a pull request.
- The release pull request must pass the full CI gate.
- Production promotion requires explicit human approval.

## develop

`develop` is the integration branch.

- Keep `develop` current with `main`.
- Do not implement directly on `develop`.
- Temporary implementation branches start from current `develop`.
- Ordinary implementation pull requests target `develop`.

## Temporary branches

Allowed prefixes:

- `feature/`
- `fix/`
- `agent/`

Normal route:

```text
main
  |
  v
develop
  |
  +--> feature/* | fix/* | agent/*
             |
             +--> PR -> develop -> CI -> merge
```

Release route:

```text
develop -> PR -> main -> full CI -> human approval -> merge
                                              |
                                              v
                                  sync main -> develop
```

## Route rules

A pull request targeting `develop` must come from an allowed temporary branch.

A pull request targeting `main` must come from `develop`.

Any other pull-request route is invalid and must fail CI.

There is no separate direct-to-`main` hotfix path. Urgent fixes follow the same integration-first route.
