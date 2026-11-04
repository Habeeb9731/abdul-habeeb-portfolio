---
title: Decision models are a cheap new way to ask AI a yes-or-no question
excerpt: Cloudflare, OpenAI and others now offer models that return typed answers with probabilities. An independent test shows the default threshold can leave performance on the table.
date: 2026-11-04
event: 2026-10-20
tag: Models
cover: /public/resources/blog/decision-models-explained.jpg
cover_alt: People with laptops and notes around a wooden table, seen from above
cover_pos: center
cover_credit: https://www.pexels.com/photo/3183150/
---
Lots of production AI work isn't writing essays. It's deciding: is this ticket urgent, did this trace fail, should a human look at this? "Decision models" are built for that. You give them input and get back a typed answer with a probability, not generated text.

## What's on offer

[Cloudflare's Clef](https://blog.cloudflare.com/clef-decision-models/), with weights under Apache 2.0, is one example. Cloudflare reports median latency of 209 ms for Clef and 39 ms for Clef-flash, and says Clef trails rival Jev on some benchmarks such as When2Call. Those are the vendor's own numbers.

## An independent test

Hamel Husain and Antaripa Saha [tested several of these](https://hamel.dev/blog/posts/decision-model-evals/) as cheap evaluators on 98 scored traces from an apartment-leasing agent:

| Model | F1 after tuning | Cents per 100 runs |
|---|---|---|
| OpenAI Decisions (GPT-6 Luna) | 0.87 | 3.72 |
| Perplexity Decider 1.1 27B | 0.79 | 0.82 |

Liquid d1 and Clef Flash fell below their 80% precision and recall minimums after tuning. It's one small dataset and one broad task, and the authors say results vary by task, so this isn't a ranking.

Their most useful finding is about method. The default 0.50 threshold often leaves performance on the table, and you should check calibration before treating a score as a confidence level. They also warn: "Be intentional, don't just use F1 score because this post did!"

## My read

This looks like a real shift in how teams will build. A full LLM is overkill for a routing decision, and a small, fast classifier that says "72% likely" is easier to reason about in code.

Just remember that a probability from an uncalibrated model is only a score. If you act on "0.8" as if it means 80% of the time, test that against real outcomes first.
