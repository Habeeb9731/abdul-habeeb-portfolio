---
title: Was the AI agent getting better, or did the reviewers change?
excerpt: A study of 2,611 production interviews found that two human reviewers differed by 0.79 standard deviations. Measuring an agent also means measuring the people scoring it.
date: 2026-11-04
event: 2026-10-04
tag: Research
cover: /public/resources/blog/agent-reliability-rater-effects.jpg
cover_alt: Two hands reviewing printed charts beside a laptop and a notebook
cover_pos: center
cover_credit: https://www.pexels.com/photo/669615/
---
Firms often judge deployed agents with repeated human ratings. [Liu Zhang and Mark Esposito's working paper](https://arxiv.org/abs/2610.07003) asks how much those ratings say about the agent, using 2,611 rubric-scored interviews from one deployed voice and video interviewing agent.

## What they found

- **Reviewers differ a lot.** Two reviewers scoring the same batches differed by 0.79 standard deviations on the composite score.
- **That can hide real change.** A shift in who was reviewing flattened the raw trend. After adjusting, reliability rose 0.53 standard deviations from March to August 2026.
- **Support tickets agree.** Interview-related tickets fell about 10% per month relative to technical tickets.
- **Drift is real.** At the estimated rate of unexplained movement, forecast uncertainty reaches the size of the biggest deploy effect after about five weeks, though that's imprecise.

The authors are careful: the data "do not identify a causal effect of evaluation on performance."

## Caveats

This is one firm and one product in a working paper, so the numbers won't simply carry over elsewhere.

## My read

The lesson is an old one, from anyone who has trained human raters: you can't track change if the ruler keeps changing. If your team scores agent output by hand, have reviewers overlap on some of the same samples, and keep a fixed set to re-score from time to time. Otherwise a new reviewer can look exactly like a regression or an improvement.

The five-week figure is also a useful nudge. Evaluating an agent once at launch doesn't tell you much about how it's doing months later.
