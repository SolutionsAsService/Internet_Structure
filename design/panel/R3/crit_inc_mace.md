# Critic: Inclusion (Mace), R3

- Anchor used: Mace P4 (perceptible information), P3 (simple, intuitive), P2 (flexibility in use), P7 (size and space).
- Observed: Playwright, real Tab, 1280x800. Landing: 9 header and button stops show solid 3px rgb(29,78,216); the 7 bands (720x49-81 px, now single links to /strata/x) have outline none but a blue box with darker fill is plainly visible (screenshot of Meet band). Atlas: search combobox, Reset show 3px outline. Typing "equin" gives role=combobox, aria-expanded=true, 1 listbox, 3 options, aria-activedescendant moves on ArrowDown; Enter selects. After selection activeElement is the panel H2 (outlined); Tab gives "Open full profile", then neighbour buttons. Enter on a neighbour leaves focus on the new H2 (not BODY); next Tab reaches that profile link. Dark mode: ring versus filled dots still distinct, labels legible. Forced colours (emulated): header and links yellow, filled/ring dots and band swatches survive; only the decorative ribbon wordmark disappears.
- Findings:
1. [resolved] R1 F1 (focus to BODY): focus now lands on the panel heading each time.
2. [resolved] R1 F2 (search Enter takes first match only): listbox with arrow selection works. Nodes stay pointer-only; the keyboard route plus A-Z list is an adequate equivalent (P2).
3. [resolved] R1 F3 (6 px ticks): ticks are no longer links; band is the target. R1 F4 and F5 resolved (evidence now cites bands; duplicate disambiguated).
4. [claim] Neighbour buttons are 23 px tall (measured), 1 px under the 24 px the evidence claims for targets. Minor, WCAG 2.2 spacing exception likely applies.
5. [claim] Hub = filled, other = ring is perceivable without colour in all three modes (landing key, atlas in dark and forced).
- Verdict: PASS (F4 is a nit, not a defect)
- Requested change: Optional: raise neighbour buttons to min-height 24 px.
