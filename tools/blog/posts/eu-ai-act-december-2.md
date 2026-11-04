---
title: The EU AI Act's big deadline moved, but 2 December still matters
excerpt: High-risk rules were pushed back to late 2027, and many people stopped there. Watermarking duties and new bans are arriving much sooner.
date: 2026-11-04
event: 2026-10-05
tag: Regulation
cover: /public/resources/blog/parliament.jpg
cover_alt: The European Parliament building in Brussels, with its emblem and the EU flag on a glass facade
cover_pos: center 30%
cover_credit: https://www.pexels.com/photo/35027603/
featured: true
---
The headline from this summer's EU Digital Omnibus was that the AI Act's high-risk rules were delayed. That's correct, but it's easy to read it as "nothing happens for a while". Something does.

## What actually changed

The amendments are [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng), and [law firm Orrick's summary](https://www.orrick.com/en/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes) sets out the new timeline:

| Date | What applies |
|---|---|
| 2 December 2026 | New bans on non-consensual intimate imagery, "nudifier" apps and child sexual abuse material |
| 2 December 2026 | End of the grace period for marking synthetic content, for systems on the market before 2 August 2026 |
| 2 December 2027 | High-risk rules for Annex III systems |
| 2 August 2028 | High-risk rules for Annex I systems |

The high-risk requirements themselves weren't removed. Their dates moved.

## Watermarking is already showing up

That grace period concerns Article 50(2), which requires AI-generated content to be marked in a machine-readable way. You can already see its effect.

On 5 October, OpenAI said it would add an invisible watermark to eligible ChatGPT and Codex text for EU users, [according to Search Engine Journal](https://www.searchenginejournal.com/openai-to-watermark-chatgpt-text-in-the-eu-opens-api-opt-in/592014/). For API customers worldwide, it's an opt-in. I couldn't open OpenAI's own post, so I'm relying on that report for the details.

The limits OpenAI reportedly gives are the useful part. On 400-token English passages, replacing 10% of words with synonyms cut detection from about 92% to 66%, and replacing 25% cut it to 17%. A missing watermark also doesn't prove a person wrote something, and the detector is limited to approved researchers and organisations at launch.

## What this means in practice

Anyone hoping for a reliable way to catch AI-written text won't get one from this. These marks are provenance signals that are easy to weaken. A university or employer treating them as proof would be making a mistake, in both directions.

I think that's fine, as long as people understand what the marks are for. They can help platforms label content at scale. They can't settle who wrote a particular essay.

## If you build with AI in the EU

This is general information, not legal advice, but I'd check these before December:

- **Does your product generate synthetic content?** If it was on the market before 2 August 2026, the grace period ends on 2 December.
- **Could it produce the newly banned content?** Orrick notes that systems are in scope where such outputs are reasonably foreseeable without adequate safeguards, not just those designed for them.
- **Are you relying on a model provider's marking?** Check what they actually do, and whether your own product removes it.
- **Are you treating December 2027 as a reason to wait?** Requirements for high-risk systems take time to build, and that date is closer than it sounds.
