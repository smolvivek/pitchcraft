# /constraint-check

Verify that a proposed feature, change, or PR does not violate any of PitchCraft's 13 hard constraints.

## Steps

1. Read `CONSTRAINTS.md` in full
2. Read the file(s), diff, or feature description the user provides
3. Check against each constraint:
   - C1: No AI generation of creative content (AI assists, never replaces)
   - C2: No creator ranking, scoring, or leaderboards
   - C3: No marketplace or creator matching
   - C4: No analytics or surveillance
   - C5: No template gallery or design flattening
   - C6: No social network features
   - C7: No surveillance or attention harvesting
   - C8: No forced monetization or upsell pressure
   - C9: No automation without explicit creator consent
   - C10: No mission creep
   - C11: No creator data extraction or resale
   - C12: No algorithmic decision-making on creative merit
   - C13: No feature bundling with other products

4. For each violation found, explain:
   - Which constraint it violates
   - The specific code or feature that violates it
   - A suggested alternative that stays within bounds

## Output Format

```
CONSTRAINT CHECK: [feature/file]
-------------------------------
C1  AI Content:       CLEAR / VIOLATION
C2  Ranking:          CLEAR / VIOLATION
C3  Marketplace:      CLEAR / VIOLATION
C4  Analytics:        CLEAR / VIOLATION
C5  Templates:        CLEAR / VIOLATION
C6  Social:           CLEAR / VIOLATION
C7  Attention:        CLEAR / VIOLATION
C8  Upsell:           CLEAR / VIOLATION
C9  Automation:       CLEAR / VIOLATION
C10 Mission Creep:    CLEAR / VIOLATION
C11 Data Extraction:  CLEAR / VIOLATION
C12 Algo Judgement:   CLEAR / VIOLATION
C13 Bundling:         CLEAR / VIOLATION
-------------------------------
Verdict: CLEAR / [N] violations found
```
