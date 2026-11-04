---
title: Anthropic replaced Git for its monorepo, and agents are the reason
excerpt: Daily merges went from about 2,500 to over 30,000 in four months. Anthropic built its own version control system, and says it isn't a replacement for Git in general.
date: 2026-11-04
event: 2026-10-13
tag: Agents
cover: /public/resources/blog/anthropic-scion-source-control.jpg
cover_alt: A dual-monitor desk setup in a room lit with blue light
cover_pos: center
cover_credit: https://www.pexels.com/photo/1714208/
---
Git assumes distributed developers who sometimes work offline. [Anthropic's engineering post](https://www.anthropic.com/engineering/redesigning-source-control) says nearly all of its clients are now always-online agents and jobs, and that Git's properties were "actively undermining our ability to scale as the repo grew."

## The scale

| Measure | Reported figure |
|---|---|
| Merges per day, May 2026 | About 2,500 |
| Merges per day, September 2026 | Over 30,000 |
| CI checkouts per day | About 25 million |
| Main branch history | Almost 100 GB |

Their in-house system, Scion, stores changes in a server-side write-ahead log, with tiered daemons, regional caches and sparse checkouts. A seven-person team built it and a code review tool, then migrated in five months. They report about 200x less CPU and memory than the previous Git mirroring, and CI checkouts in seconds instead of minutes.

## What it isn't

You can't use it. It's internal, and Anthropic says it's "by no means a suitable replacement for git for general use" because parts are "highly bespoke". It's sharing the design in the hope that parts can be applied to Git. These are also the company's own figures.

## My read

Very few companies have this problem, so I wouldn't rush to replace Git. What I find more interesting is the pressure behind it. A twelvefold jump in merges in four months means review, CI and version control are all being asked to handle far more change. Most teams will feel that first in review and CI, long before Git itself becomes the limit.
