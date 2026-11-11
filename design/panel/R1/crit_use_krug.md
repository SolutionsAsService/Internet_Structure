# Critic: Usability (Krug) - R1

- Anchor used: Krug, Don't Make Me Think: five-second test on the first screen; what is clickable; first action's visibility; needless words.

- Observed: At 1280 (r1__1280.png) the h1 "No one owns the internet. 253 organisations hold it up." is legible, the paragraph and two buttons ("Explore the atlas", "How a request travels") sit beside the figure, all in the first screen; evidence puts the figure bottom at 678 px. At 375 (r1__375.png) the first screen is nav, h1 and figure only; the paragraph starts at the very bottom, the buttons are below the fold (evidence: moved below the figure). Red path steps 1-6 (Comcast, Equinix, Grace Hopper, Google, Verisign, ICANN) are labelled and traceable at both widths. Legibility probe: PASS at 1280 (Comcast touches Equinix; Equinix touches Comcast and Grace Hopper). At 375 the path is traceable and nameable, but what the line means is explained only in text cut off at the fold.

- Findings:
F1 [defect] 375: the first action (the "Explore the atlas" button) is not in the first screen; only the small nav row is. Visitor must scroll to learn what to do.
F2 [defect] Two numbering systems collide in one figure: big stratum numerals 1-7 on the left and red path steps 1-6 ("4 Google" sits in stratum 7, "1 Comcast" in stratum 4). The visitor must decode which number is which.
F3 [defect] 375: history labels "Bell System 1877" and "ARPANET 1969" overlap into unreadable text on the time axis.
F4 [defect] Clickability is unsigned: dots and bands have no button affordance; the only cue is grey caption text "Tap a stratum to open it", placed under the figure, small, easy to skip.
F5 [claim] "Carry / Wire / Meet / Name / Serve / Make" are one-word coinages; sublines ("Carriers & access") rescue them, but the headline label alone requires learning.
F6 [claim] The dashed NVIDIA-TSMC branch and long Google-Grace Hopper stroke are unexplained at 375; the line's meaning ("recorded connections") is needed before it is readable.
F7 [premise] The hero is both figure and instruction; the 253-dot grid is strangeness that earns its place and I do not object to it.

- Verdict: OBJECT

- Requested change: At 375, put one visible button ("Explore the atlas") and a one-line key for the red line ("Red line: one chain of real connections, Comcast to ICANN") above or directly under the h1, before the figure. Recolour or restyle the path step numbers (e.g. in circled badges) so they differ from stratum numerals. Fix the history label collision at 375 (hide one label or stagger). Make strata bands carry a visible link cue (arrow or underline on the name).
