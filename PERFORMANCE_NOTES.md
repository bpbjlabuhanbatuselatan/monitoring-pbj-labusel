# Performance branch

This branch is isolated from `stable-2026-08-26`.

Performance work is intentionally conservative: no UI, role, login, report, monitoring, verification, activity-log, or photo-compression behavior is changed here.

Optimization targets for later measured changes:
- reduce unnecessary initial data loading
- defer heavy/non-visible content
- avoid repeated identical reads
- debounce search/input requests
- lazy-load report images
- paginate large report/activity datasets

No optimization is promoted to `main` without verification against the stable baseline.
