# PRICING.md — PitchCraft Pricing Strategy

**Status:** Approved (Feb 2026)
**Rule:** Claude does NOT change pricing without explicit creator approval.

---

## Three Tiers + Metered AI + Graduated Funding Commission

---

### Free — $0/forever

| | |
|-|-|
| Active pitches | **1** |
| Sections | 8 required + **5 optional** (creator chooses which 5) |
| Media uploads | **3 images per section** (10MB each), 1 PDF (50MB) |
| Storage | **100MB** |
| Share link | **Public only** |
| AI | **None** |
| Video embeds | **None** |
| Version history | **1 snapshot** (current only) |
| Funding | **Yes — 8% commission** |
| Pitch slug | Random UUID |
| Branding | "Made with Pitchcraft" footer |
| View notifications | None |
| Collaborators | None |
| PDF export | None |
| Custom sections | None |

**Why this converts:** Free lets a creator build and share one real pitch. But the moment they need any of these, they hit a wall that only Pro solves:
- **Privacy** — they want to send it to a specific producer, not publicly
- **Second pitch** — new project, can't create it
- **AI** — they see the AI buttons but can't use them without Pro
- **Video embeds** — can upload images but can't embed a trailer/reel
- **More sections** — 5 optional sections isn't enough for a serious pitch
- **Custom slug** — UUID looks unprofessional when sharing verbally
- **Branding** — "Made with Pitchcraft" on a pitch sent to a studio exec
- **Version history** — pitch evolves but they can't track changes
- **Lower commission** — raising $5K costs $400 on free vs $250 on Pro

**Cost to PitchCraft per free user: ~$0** (1 pitch, no AI, negligible storage/bandwidth)

---

### Pro — $12/month ($9/month billed annually)

| | |
|-|-|
| Active pitches | **Unlimited** |
| Sections | **All 18 optional + 3 custom** |
| Media uploads | **10 images per section**, unlimited PDFs |
| Storage | **2GB** |
| Share link | **Public, private, or password-protected** |
| AI text assists | **15/day** |
| AI image generation | **5/day** |
| Video embeds | **Yes** (YouTube, Vimeo, any URL) |
| Version history | **Unlimited** |
| Funding | **Yes — 5% commission** |
| Pitch slug | **Custom** (`pitchcraft.app/p/my-film`) |
| Branding | **None** (no Pitchcraft footer) |
| View notifications | **Basic** ("someone viewed your pitch") |
| Collaborators | **2 per pitch** |
| PDF export | **Clean layout** |
| Custom sections | **3** |

**Margin: ~$8-11/month per Pro user** (costs us ~$0.55)

---

### Studio — $29/month ($22/month billed annually)

| | |
|-|-|
| Active pitches | **Unlimited** |
| Sections | **All 18 optional + 3 custom** |
| Media uploads | **Unlimited images per section**, unlimited PDFs |
| Storage | **10GB** |
| Share link | **Public, private, or password-protected** |
| AI text assists | **Unlimited** |
| AI image generation | **15/day** |
| Video embeds | **Yes** |
| Version history | **Unlimited** |
| Funding | **Yes — 3% commission** |
| Pitch slug | **Custom** |
| Branding | **None** |
| View notifications | **Detailed** (when, time spent, which sections viewed) |
| Collaborators | **5 per pitch** |
| PDF export | **Branded** (custom logo, colors, footer) |
| Custom sections | **3** |
| Priority support | Yes |
| Early access | Yes |

**Margin: ~$19-27/month per Studio user** (costs us ~$1.75)

---

## AI Credit Packs — Pay-as-you-go (Pro and Studio only)

| Pack | Price | Per-unit |
|------|-------|----------|
| 10 AI images | $1.50 | $0.15/image |
| 50 AI images | $6.00 | $0.12/image |
| 10 AI text assists | $0.50 | $0.05/assist |

Not available on Free. AI is a paid feature.

---

## Funding Commission by Tier

| Amount Raised | Free | Pro | Studio |
|--------------|------|-----|--------|
| First $5,000 | 8% | 5% | 3% |
| $5,001 – $25,000 | 8% | 5% | 3% |
| $25,001+ | 8% | 3% | 2% |

*Stripe's 2.9% + $0.30 per transaction is separate.*

---

## Side-by-Side

```
                    FREE        PRO ($12)      STUDIO ($29)
─────────────────────────────────────────────────────────────
Pitches             1           Unlimited       Unlimited
Sections            8 + 5       8 + 18 + 3      8 + 18 + 3
Images/section      3           10              Unlimited
Storage             100MB       2GB             10GB
Video embeds        ✗           ✓               ✓
Privacy             Public      Pub/Priv/Pass   Pub/Priv/Pass
AI Text/day         ✗           15              Unlimited
AI Images/day       ✗           5               15
Versions            1           Unlimited       Unlimited
Funding commission  8%          5%              3% (2% >$25K)
Custom slug         ✗           ✓               ✓
Branding removed    ✗           ✓               ✓
View notifications  ✗           Basic           Detailed
Collaborators       ✗           2/pitch         5/pitch
PDF export          ✗           Clean           Branded
Custom sections     ✗           3               3
```

---

## What Compels Free → Pro (9 Triggers)

1. **Privacy** — can't send privately to a producer/client
2. **Second pitch** — new project, need another slot
3. **AI** — text assist and image generation buttons visible but locked
4. **Video embeds** — can't embed trailer/reel/reference
5. **More sections** — only 5 of 18 optional sections available
6. **Custom slug** — UUID looks unprofessional
7. **Branding** — "Made with Pitchcraft" on shared link
8. **Version history** — can't track pitch evolution
9. **Commission** — 8% vs 5% on funded amounts (saves $150 per $5K raised)

---

## Backend Cost Per User

| User Type | Cost/month |
|-----------|-----------|
| Free | **~$0** (1 pitch, no AI, negligible) |
| Pro | ~$0.55 |
| Studio | ~$1.75 |

---

## Year 1 Projection (1,000 users)

| Stream | Annual |
|--------|--------|
| Pro subscriptions (200 users) | $24,000 |
| Studio subscriptions (50 users) | $15,000 |
| Funding commission | $30,000 |
| AI credit packs | $3,600 |
| **Total revenue** | **$72,600** |
| **Total costs** | **$2,340** |
| **Margin** | **~97%** |

Free users now cost near-zero (no AI), improving margin from 93% to 97%.
