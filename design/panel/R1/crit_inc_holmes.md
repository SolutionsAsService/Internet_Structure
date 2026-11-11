Critic: Inclusion (Holmes), R1

- Anchor used: Recognize exclusion; learn from diversity (permanent/temporary/situational); solve for one, extend to many.

- Observed: Probes clean (0 overflow, 0 contrast/target fails, 3px focus ring, reduced-motion CSS block, dark tokens, forced-colors rule, no-JS landing keeps 253 dots). Landing SVG (StrataFigure.jsx) has role=img + title + desc naming the route; bands are real links with full aria-labels. Atlas SVG (app/atlas/page.jsx:37) is one role=img with a single label; the panel (aria-live) lists neighbours as buttons, and "Every organisation, A to Z" links out. Shot r1__375.png: figure is a thumb-width ladder, but "Bell System 1877" and "ARPANET 1969" labels collide. atlas_sel_375.png: Equinix selected, ~60 red lines and overlapping labels; zoom +/- sit bottom-right of the map.

- Findings:
F1 [defect] Landing 375 shot: history labels "Bell System 187/ARPANET 1969" overprint, so the oldest dossier names are unreadable (situational: small screen, glare).
F2 [claim] Evidence says smallest SVG text is 12 px at 375; "no small-text failure" is only contrast-tested, so low-vision readers get no size pass.
F3 [premise] Atlas premise is that a pointer-drag map is the primary way in; the 253 dots are not individually focusable (role=img), so keyboard/screen-reader users reach organisations only via search or the A-Z list. The A-Z link is placed last in the aside, after the hint text.
F4 [defect] Search selects only matches[0] on Enter; no visible results list was observed, so a typo-prone or switch/voice user cannot choose among matches.
F5 [claim] "Select a stratum to open it" is conveyed by a caption only; band links give no visible affordance beyond the caption (shot r1__375).
F6 [premise] Selection state is conveyed by red lines plus opacity; the dot ring on Equinix is the only non-colour cue; colour-blind readers get weak redundancy for "connected vs not".

- Verdict: OBJECT

- Requested change: (1) Stagger or abbreviate the two oldest history labels at 375. (2) Raise SVG text floor to 14 px at 375. (3) Move the A-Z alternative above the map and name it as the equal path. (4) Show a results list for search with arrow/Enter selection. (5) Add a non-colour cue (heavier stroke or label) for connected nodes. Strengths to keep: no-JS dots, descriptive desc, reduced-motion rule.
