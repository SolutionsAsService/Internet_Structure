# Critic: Inclusion (Mace), R5

- Anchor used: Mace P4 (perceptible information), P2 (flexibility), P3 (simple, intuitive).
- Observed: Playwright, real Tab x9 per page, 1280x800, then port 3100 went down (no retake). Landing header and hero: wordmark, 5 nav links, both hero buttons carry a 3px outline rgb(138,180,255) offset 2px, about 9:1 on #0e1117: clearly visible (screenshot, "How it works" ringed). Stratum (Carry), history, history/arpanet, organisations/equinix, atlas: 3px rgb(29,78,216) on paper/copper/wash, strong. Hub filled vs other ring is shape, colourless-safe. But the FIRST Tab stop on the landing, "Skip to content" (y=8, over the dark header), keeps the paper-page ring rgb(29,78,216): about 2.5:1 against #0e1117, under the 3:1 non-text bar.
- Findings:
1. [defect] Skip link ring on the dark landing is #1d4ed8 on #0e1117 (about 2.5:1); the light-blue override covers every other landing stop but not this one. It is the first thing a keyboard user sees.
2. [resolved] Focus on dark hero, dark header, stratum-coloured and copper pages is visible elsewhere.
3. [claim] Hub/other perceivable without colour (filled vs ring, stated in key and text).
4. [premise] Atlas nodes pointer-only, search plus neighbours is an equivalent route; not a defect.
- Verdict: OBJECT (small, one rule)
- Requested change: apply the #8ab4ff focus ring to the skip link when it sits on the night header (or give the skip link a white 2px inner ring), then retake the Tab-1 screenshot.
