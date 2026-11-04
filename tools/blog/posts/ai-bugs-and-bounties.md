---
title: AI is finding real bugs and flooding bug bounties, both at the same time
excerpt: In one month, Google paused an open-source bug bounty over invalid automated reports and launched a model it says leads on finding vulnerabilities. The two stories belong together.
date: 2026-11-04
event: 2026-10-28
tag: Security
cover: /public/resources/blog/bugs.jpg
cover_alt: A computer monitor filled with lines of security and system output in a dark room
cover_pos: center
cover_credit: https://www.pexels.com/photo/5380664/
featured: true
---
Two pieces of Google news from October tell opposite stories about AI and security. I think both are true.

## The bounty that stopped taking reports

On 5 October, [BleepingComputer reported](https://www.bleepingcomputer.com/news/google/google-halts-open-source-bug-bounty-program-amid-ai-spam-surge/) that Google had paused new product vulnerability reports to its Open Source Software Vulnerability Rewards Program. The program covers projects including Golang, Angular, Bazel, Protocol Buffers and Fuchsia.

Google's stated reason was blunt: "a significant rise in automated submissions, the vast majority of which are not valid."

The pause isn't total. Supply chain reports, reports already in progress and patch rewards all continue, and Google has promised an update in the first quarter of 2027. Note the wording too: Google said "automated". The AI framing is in the headline, and it's a reasonable inference, but it isn't Google's own statement.

## The model that finds real ones

Three weeks later, on 28 October, Google [announced Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/), which it calls its "strongest model with state-of-the-art cybersecurity and long horizon capabilities". Its reported scores:

| Benchmark | Task | Google's reported score |
|---|---|---|
| SEC-bench Pro | Finding vulnerabilities | 88.2% |
| ExploitGym | Exploiting them | 54.8% |
| CWE-bench | Patching them | 71.0% |

Those are the company's own published numbers, and I haven't seen independent replication yet. Carbon isn't generally available either. It started with a subset of cyber defenders, and Google says more trusted partners will follow gradually.

## Why both can be true

Finding bugs and reporting bugs are different activities with different economics.

A skilled person using a strong model can find real flaws faster. But anyone can also point a cheap script at a repository and file whatever comes out. Generating a report now costs almost nothing, while checking one still costs a maintainer's time. That gap is the real problem, and better models don't close it by themselves. They make the good reports better and the bad ones more convincing.

That's my reading, not a finding from either source. But it fits Google's own numbers: its bounty programs paid a record $17.1 million in 2025, so this is not a company losing interest in outside researchers.

## What I'd watch

- **Google's update in early 2027.** How it reopens the program will show what actually filters this kind of noise.
- **Other bounty programs.** Smaller projects have far fewer people to triage reports than Google does.
- **Independent tests of security models.** Vendor benchmarks are a starting point, not a verdict.
