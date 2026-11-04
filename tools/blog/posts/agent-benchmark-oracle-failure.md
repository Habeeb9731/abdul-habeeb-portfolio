---
title: One bug in a benchmark's scoring moved agent success from 94.3% to 65.5%
excerpt: A new preprint audits an agent benchmark and finds a reward function that changed the state it was grading. Fixing it changed which agent came out on top.
date: 2026-11-04
event: 2026-10-12
tag: Research
cover: /public/resources/blog/agent-benchmark-oracle-failure.jpg
cover_alt: A hand with a pen marking a printed chart
cover_pos: center
cover_credit: https://www.pexels.com/photo/590022/
---
Agent benchmarks get quoted constantly, so a basic question is worth asking: is the scoring itself correct? [A preprint by Junjie Chen](https://arxiv.org/abs/2610.16067) audits exactly that.

## The finding

On a widely used agent benchmark, a reward function reset the database to build a ground-truth hash, and never restored it. So the checker was disturbing what it was checking.

| Over 4,320 episodes | Database passes | Success |
|---|---|---|
| Recorded labels | 4,194 | 94.3% |
| Replayed correctly | 2,883 | 65.5% |

The correction wasn't uniform. It removed 24 to 34 points from each agent, which changed which agent was strongest in the comparison.

The audit method uses five state-integrity checks and three known-answer controls, and it caught all seven injected defect classes. It comes with a replication package that recomputes the analysis offline.

## Caveats

This is a single-author preprint, submitted to a journal and not yet peer reviewed. The findings on configuration effects are described as weaker evidence. The method also didn't transfer to a second, independently implemented benchmark, so this isn't a universal audit tool yet.

## My read

Benchmark results get treated like measurements, but a benchmark is software, and software has bugs. A 29-point error that also reorders the leaderboard is a good reason to ask, for any agent score you rely on, whether anyone has checked the checker. If you run your own evaluations, try the simplest version of this: include some tasks where you already know the right answer.
