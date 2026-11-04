---
title: Kimi K3.1 Pro narrows the open-model gap, if the weights arrive
excerpt: Artificial Analysis ranks Moonshot's model fourth overall and first on Terminal-Bench 4.0. When the article ran, the weights weren't out yet.
date: 2026-11-04
event: 2026-10-23
tag: Models
cover: /public/resources/blog/kimi-k3-1-pro.jpg
cover_alt: A full moon against a black sky
cover_pos: center
cover_credit: https://www.pexels.com/photo/1302434/
---
[Artificial Analysis published its benchmarks](https://artificialanalysis.ai/articles/kimi-k3-1-pro-launch-benchmarks) for Moonshot's Kimi K3.1 Pro on 23 October. This is a third-party evaluation, which makes it more useful than most launch-day numbers.

## How it scores

| Measure | Kimi K3 | Kimi K3.1 Pro |
|---|---|---|
| Intelligence Index | 44 | 55 |
| Terminal-Bench 4.0 | 13% | 67% |
| AutomationBench-AA | 58% | 73% |
| Hallucination rate (AA-Omniscience) | 53% | 44% |

The index of 55 puts it fourth, behind Claude Opus 5.5 (58), Claude Sonnet 5.5 and Muse Wonder Full (both 56). Its 67% on Terminal-Bench 4.0 was the highest of any model.

Pricing is $2 per million input tokens and $10 per million output, 33% below K3. It's a very large model, with 2.8T total parameters and 104B active.

## The catch

At the time of that article, the weights weren't published. Artificial Analysis says that once they are, it will be the top open-weights model, cutting the open-versus-proprietary gap from 12 points to 3. Some coverage already calls it open-weight, so check the current status and the licence, which the article doesn't state.

A 44% hallucination rate on that test is also still high, even as an improvement.

## My read

A three-point gap would be a big deal if it holds. It would change what "we need a frontier API" means for many teams. Still, 104B active parameters isn't something you run on a spare machine, so "open" here mostly means choosing among hosting providers, or being able to host it at all if you have the budget.
