---
title: Mistral Large 4 is a trillion-parameter bet on European AI
excerpt: Mistral trained its new open-weight model on its own European GPUs. Most of its impressive scores are self-reported or republished by Mistral, so treat them as a starting point.
date: 2026-11-04
event: 2026-10-06
tag: Models
cover: /public/resources/blog/mistral-large-4.jpg
cover_alt: Close-up of a chip on a red circuit board
cover_pos: center
cover_credit: https://www.pexels.com/photo/6636497/
---
[Mistral Large 4](https://mistral.ai/news/mistral-large-4/), announced on 6 October, is a 1-trillion-parameter multimodal model with 52 billion active at a time. Mistral says it trained it from scratch on 3,800 NVIDIA Grace Blackwell GPUs in its own European datacentres.

## The numbers

Mistral's public preview API costs $0.70 per million input tokens and $2.10 per million output, with cached input at $0.07. The post promised open weights "by the end of the month". It doesn't name a licence, and I haven't confirmed the release, so check before planning around it.

| Benchmark | Reported score |
|---|---|
| DeepSWE v1.1 | 61.7% |
| Terminal-Bench 4 | 28.3% |
| Cybench | 93% (self-reported) |
| Surge AI blind coding eval | 3.74/5, second of five |

Most headline numbers come from Mistral itself. Others are attributed to Artificial Analysis, vals.ai, Surge AI and Lakera, but the post doesn't say how independently those were run.

## Why "sovereign" matters here

The pitch isn't only about scores. Mistral says it can run a European deployment end to end from its own datacentres. That matters to governments and regulated companies in ways a benchmark can't capture, especially with [EU AI Act deadlines](/blog/eu-ai-act-december-2/) approaching.

## My read

I'm more interested in the infrastructure than the leaderboard. Owning the GPUs and the datacentres is a much bigger commitment than releasing a model, and it's what makes the sovereignty claim more than marketing. Whether it's the right model for a given job is something only your own evaluation can tell you.
