# CONSTRAINTS.md — Hard Boundaries

(Working title product: TBD)

This document defines what the product will **never** build, and why.

These are not limitations. They are protections.

If a feature request conflicts with these constraints, the answer is no. Even if users ask. Even if it seems profitable.

---

## Constraint 1: No AI Generation of Creative Content

**We will not:** Build AI that generates scripts, screenplays, story concepts, or narrative content for creators.

**Why:** 
- This violates the "creator control" principle. Generated content is not the creator's intent.
- It commodifies creative work and incentivizes speed over craft.
- It positions Pitchcraft as a "content factory," not a tool for intentional creators.

**What we allow instead:**
- AI image generation for *reference* visuals (pay-as-you-go, optional)
- AI summarization of creator-written text (optional, reversible)
- AI suggestions for section completion (always optional, never enforced)

**Hard line:** No AI writes the logline, synopsis, or any narrative-essential text. Creators write. AI suggests at most.

---

## Constraint 2: No Creator Ranking, Scoring, or Leaderboards

**We will not:** Rank pitches, rate projects on "viability," score creators, or display leaderboards.

**Why:**
- Ranking flattens diverse creative work into a single metric.
- It turns Pitchcraft into a competition, not a tool.
- Creators start optimizing for the algorithm instead of the work.
- It creates perverse incentives (popularity over quality, commercial appeal over artistic intent).

**What we allow instead:**
- Search/discovery (Phase 2+, optional for creators to opt-in to)
- Public pitch links (creators choose visibility)
- Funding success as a signal (if you raised money, it shows in your pitch history)

**Hard line:** No visible scoring. No ranking. No "trending" pitches. No algorithmic recommendations.

---

## Constraint 3: No Marketplace or Creator Matching

**We will not:** Build a marketplace where funders "shop for" projects, or where studios search for creators to hire.

**Why:**
- This creates a power imbalance (creators become inventory to be evaluated).
- It encourages producers to cherry-pick based on algorithmic ranking or hype.
- It positions Pitchcraft as a hiring/talent platform, not a pitch tool.
- It incentivizes Pitchcraft to manipulate which pitches are visible.

**What we allow instead:**
- Direct sharing (creator sends their link to specific people)
- Opt-in discoverability (Phase 2+, creators choose if searchable)
- Creator networking (Phase 2+, light—functional, not social)

**Hard line:** Pitchcraft is not a job board, marketplace, or talent platform. Creators control who sees their pitch.

---

## Constraint 4: No Analytics or Surveillance

**We will not:** Track viewer engagement, "engagement metrics," click-through rates, view duration, or any behavioral analytics on creator pitches.

**Why:**
- Surveillance erodes trust.
- Analytics incentivize creators to optimize for engagement, not clarity.
- It turns creator data into a product to monetize.
- Creators should never wonder if Pitchcraft is profiling them.

**What we allow instead:**
- Version history (creators see their own evolution)
- Simple "link accessed" notifications (for private/password-protected links only, "someone viewed this")
- Funding transactions (creators need to know about donations)

**Hard line:** No tracking pixels. No engagement funnels. No heat maps. No behavioral data sold or used to optimize the platform.

---

## Constraint 5: No Template Gallery or Design Flattening

**We will not:** Offer "pitch deck templates," design templates, or style presets that creators feel pressured to use.

**Why:**
- Templates create visual conformity (everything looks the same).
- They encourage copying instead of thinking.
- They flatten unique creative visions into standardized aesthetics.
- Creators start choosing designs based on "what looks professional," not what serves their work.

**What we allow instead:**
- Design system (consistent, restrained, calm—but not a template)
- Customizable fields (creators add what's relevant to them)
- Media flexibility (creators upload their own images, or generate, or use references)
- Responsive layout (works on mobile, desktop—but the same aesthetic everywhere)

**Hard line:** No pre-built templates. No design gallery. No "choose your vibe." One consistent, calm aesthetic. Creators customize content, not design.

---

## Constraint 6: No Social Network Features

**We will not:** Build feeds, activity streams, presence indicators, comments, likes, follows, or social discovery.

**Why:**
- Social features create engagement addiction.
- They incentivize creators to post frequently and seek validation.
- They turn Pitchcraft into a social network, not a tool.
- Network effects pressure creators into behaviors that aren't about pitching.

**What we allow instead:**
- Collaboration (Phase 2+, functional—multiple producers can work on one pitch, no performance metrics)
- Light creator networking (Phase 2+, functional—"find producers," not "discover creators")
- Direct messaging (Phase 2+, functional only—not a social feature)

**Hard line:** No feeds. No algorithmic distribution. No "trending" or "featured." No likes or engagement metrics. No presence ("online now"). No social validation loops.

---

## Constraint 7: No Surveillance or Attention Harvesting

**We will not:** Use dark patterns, addictive UI, infinite scroll, push notifications, or any technique designed to harvest attention.

**Why:**
- Pitchcraft's business model is subscription + commission, not engagement/ad-driven.
- Attention harvesting erodes creator trust and autonomy.
- It corrupts the tool's core purpose (clarity and control).

**What we allow instead:**
- Email notifications (opt-in, for important events: funding received, version viewed)
- In-app notifications (only when something requires action)
- Calm, intentional UI (animations that clarify, not distract)

**Hard line:** No autoplay. No infinite scroll. No push notification spam. No red-dot badges designed to trigger anxiety. No addictive patterns.

---

## Constraint 8: No Forced Monetization or Upsell Pressure

**We will not:** Create a "freemium" model where free tier is intentionally gimped to pressure upgrades.

**Why:**
- Pitchcraft should serve creators first, not revenue goals.
- Artificial limitations create resentment and distrust.
- Creators should feel the product is fair and sustainable, not extractive.

**What we allow instead:**
- True freemium (free tier is functional, just with limits on number of pitches or custom sections)
- Clear, honest tiers (paid tier is valuable, not punitive)
- Optional features that are nice-to-have, not essential (AI image generation is pay-as-you-go because it costs money; not because we're withholding a core feature)
- Transparent pricing (no hidden fees, no surprise charges)

**Hard line:** No dark patterns around pricing. No "free tier with 99% of features disabled." No bait-and-switch.

---

## Constraint 9: No Automation Without Explicit Creator Consent

**We will not:** Silently automate, batch-process, or apply changes to creator content without explicit, informed consent.

**Why:**
- Creators must always control their work.
- Hidden automation erodes trust.
- It invites feature creep ("the system will help you").

**What we allow instead:**
- Explicit AI suggestions (creator sees suggestion, accepts or rejects)
- Optional batch operations (creator reviews and confirms before applying)
- Clear "this will change your content" warnings
- Reversible actions (creator can undo)

**Hard line:** No silent processing. No background AI "improving" content. No batch automation without review. All changes visible and reversible.

---

## Constraint 10: No Mission Creep

**We will not:** Build features "because it might be useful" or to expand into adjacent markets.

**Why:**
- Feature creep dilutes focus.
- It introduces complexity that serves profit, not creators.
- It turns Pitchcraft from a focused tool into a bloated platform.

**What we will do instead:**
- Ship MVP (presentation + funding + versioning, nothing else)
- Wait for creator feedback and signal before Phase 2
- Ruthlessly prioritize (each new feature must solve a clear, stated problem)
- Delete features that don't serve the core mission

**Hard line:** No "just add one more thing." No speculative features. No "we'll build it and see if it sticks." One feature at a time. Explicit approval required.

---

## Constraint 11: No Creator Data Extraction or Resale

**We will not:** 
- Sell creator data to third parties
- Mine pitch content for patterns to sell insights
- Use creator projects as training data (without explicit consent)
- Build datasets from pitches for competitive purposes

**Why:**
- Creator data is sacred.
- If Pitchcraft ever changes hands, new owners shouldn't inherit creator profiles.
- Pitchcraft's value comes from trust, not data leverage.

**What we allow instead:**
- Aggregate, anonymized analytics (for our own product development only)
- Creator consent for specific data uses (opt-in, not default)
- Transparent data policies (creators know exactly what we collect)
- Data portability (creators can export their pitch data)

**Hard line:** Creator data belongs to creators. Pitchcraft is a steward, not an owner.

---

## Constraint 12: No Algorithmic Decision-Making on Creative Merit

**We will not:** Use AI or algorithms to judge creative quality, commercial viability, or likelihood of success.

**Why:**
- Algorithms are biased (often toward demographics, genres, styles that are algorithmically "popular").
- They reduce creative work to metrics.
- They discourage risk-taking and experimentation.
- They position Pitchcraft as an evaluator, not a tool.

**What we allow instead:**
- Data about funding (if a pitch raised money, it shows in history)
- Creator-chosen metadata (genre, format, status—creator input only)
- Search filters (creators find pitches if they opt into discovery)
- No algorithmic scoring or recommendations

**Hard line:** No "this pitch has X% chance of success." No algorithmic viability scoring. No AI-driven recommendations of "similar projects."

---

## Constraint 13: No Feature Bundling with Other Products

**We will not:** Force creators to use other products or services to use Pitchcraft effectively.

**Why:**
- Pitchcraft should stand alone.
- Bundling creates lock-in and reduces choice.
- Creators should never feel pressured to use tools they don't want.

**What we allow instead:**
- Optional integration with writing tools (Phase 2+, creator can opt-in)
- AI assistance as an optional feature (not forced)
- Clear separation of products (Pitchcraft works without anything else)

**Hard line:** Pitchcraft MVP works standalone. No external product required. Full stop.

---

## Summary: The Principle

These constraints protect Pitchcraft's core mission: **to serve creators, not extract value from them.**

If a feature or business model violates these constraints, it doesn't matter how profitable or "competitive" it is.

The answer is no.

Pitchcraft's moat is trust. These constraints are how we earn and keep it.
