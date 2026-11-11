# Critic: Evidence (Cairo), R2

- Anchor used: Alberto Cairo, The Truthful Art and How Charts Lie. Each channel means one stated thing; say what is not measured; a headline number must survive reproduction.
- Observed: I reproduced the headline from data/internet.json with my own script (merge by id, fold-match references, undirected dedupe, rank by degree). I got 43 as the fewest organisations reaching half of all link endpoints. My script found 677 links (no alias table), against the site's 691. The result is 43 either way. The site's rule and the test (minimal set) are in lib/data.js and /about#counting. The top 10 alone hold 25%. Screenshot r2__1280.png: 43 ink dots, 210 grey, one dot size, red only on route and badges, ticks in ink, caption states "position along a band means nothing" and the Verisign rule, lede says "in this dataset".

Findings
F1 [claim] Wording: the lede says the 43 "hold half of all 691 recorded connections". They hold half of the link endpoints (696 of 1,382), and touch 594 of 691 links (86%). A link between two hubs counts at both ends. /about says it correctly; the landing paraphrase is looser.
F2 [premise] "Hold" is degree in a hand-curated list, so it measures how many connections the author recorded, not traffic or control. The lede has "recorded" but not "in this dataset" beside the 43.
F3 [defect, minor] Ties: the 43rd hub has 7 connections and at least four other organisations also have 7. The count 43 is robust. Which of those dots is ink is a tie-break (importance, then name), and that is not disclosed.
R1 resolved: F1, F2 (size scrapped), F3 (caption), F4 (ticks in ink, key inside SVG), F5 (caption), F6 (lede and /about#gaps link), F7 (/about#counting), F8 (labels removed from the landing, years listed on /history).

Verdict: PASS (F1-F3 are wording and disclosure, not misdrawing; the figure reproduces)

Requested change: F1 in the lede, "hold half of all link endpoints: they touch 594 of 691 connections". F3 add to /about#counting: "ties at 7 connections are broken by importance, then name".
