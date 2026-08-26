# Performance Stage 1

No application behavior is changed in this stage.

Safety rule: the stable branch remains untouched. Performance changes must be isolated and measured before promotion.

Candidate optimizations identified from the current client:
- dashboard startup currently loads multiple datasets for PPK/PPBJ (`loadMasterProyek`, `loadLaporan`, `loadPimpinanDashboard`, `loadVerifikasi`).
- admin startup loads several admin datasets.
- later stages should defer datasets until their menu is opened, but only after confirming each menu's data dependency.

Stage 1 therefore records the bottleneck without changing the UI or data flow yet.
