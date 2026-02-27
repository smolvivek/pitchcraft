# /copy-review

Review UI text and marketing copy against PitchCraft's voice: precise, cinematic, zero waste.

## Voice Principles

- **Apple-level economy.** Every word earns its place. If a sentence works without a word, cut it.
- **Cinematic confidence.** Speaks like a filmmaker, not a marketer. No hype, no exclamation marks.
- **Concrete over abstract.** "One link" not "seamless sharing experience."
- **Active voice.** "Present your work" not "Your work can be presented."
- **No startup jargon.** No "leverage," "synergy," "empower," "unlock," "supercharge," "game-changing."
- **No filler words.** No "just," "really," "very," "actually," "basically," "simply."
- **No false urgency.** No "Don't miss out!" or "Limited time!"
- **Industry-literate.** Knows what a logline is. Knows what a producer needs. Doesn't explain the obvious.

## Steps

1. Read the file or text the user provides
2. For each piece of copy, assess:
   - Is every word necessary?
   - Is it concrete or vague?
   - Does it sound like a filmmaker or a SaaS marketer?
   - Is the tone confident without being arrogant?
   - Would Apple ship this sentence?

3. Provide:
   - Current text (quoted)
   - Problem (why it fails)
   - Rewrite (tighter version)

## Output Format

```
COPY REVIEW: [file/section]
-------------------------------

1. "[current text]"
   Problem: [why it's weak]
   Rewrite: "[improved version]"

2. "[current text]"
   Problem: [why it's weak]
   Rewrite: "[improved version]"

-------------------------------
Score: [X/10] — [one-line summary]
```
