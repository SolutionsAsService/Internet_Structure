# Critic: Inclusion (Mace), R6

- Anchor used: Mace P4 (perceptible information), P2 (flexibility).
- Observed: Playwright, real Tab x5 on / at 1280x800. Stop 1 "Skip to content" (y=8): outline rgb(255,255,255) 3px, box-shadow rgb(29,78,216) 6px. Screenshot shows a bright white edge inside a blue band, clearly visible on the dark header, and legible without colour (white vs black). Stops 2-5 (InternetStructure, Atlas, Strata, History): 3px rgb(138,180,255) offset 2px on #0e1117, about 9:1.
- Findings:
1. [resolved] R5 F1: skip-link ring was about 2.5:1; now white (about 18:1) plus blue band. Fixed.
2. [resolved] Next four stops keep a strong ring.
3. [note] The focused skip link overlaps the wordmark while focused; transient and expected for a skip link, not a defect.
- Verdict: PASS
- Requested change: none.
