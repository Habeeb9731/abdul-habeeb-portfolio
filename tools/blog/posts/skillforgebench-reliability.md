---
title: Agents pass most individual checks, then fall apart when all of them have to pass
excerpt: SkillForgeBench found rubric pass rates of 70–85.7%, but only 12.6–40.9% strict completion. The gap may be closer to how agents behave in real work.
date: 2026-11-04
event: 2026-10-10
tag: Research
cover: /public/resources/blog/skillforgebench-reliability.jpg
cover_alt: A woman working at a desk in front of monitors showing code
cover_pos: center
cover_credit: https://www.pexels.com/photo/3861958/
---
A benchmark score can hide a lot, depending on what counts as success. [SkillForgeBench](https://arxiv.org/abs/2610.14918), a preprint submitted on 10 October, tests eight mainstream agents on 842 sandboxed tasks across five professional domains.

## The headline gap

Individual rubric pass rates ranged from 70.0% to 85.7%. Requiring every constraint on a task to be satisfied dropped results to 12.6% to 40.9%. Opus 4.8 led with 40.9% strict completion.

If you've used agents on real work, that may feel familiar: they do most of what you asked, and miss one requirement.

Two more findings:

- **Process lags outcome.** Agents met process rubrics far less often than completion rubrics, with Haiku 4.5 under 3%. The authors conclude that "completion-only checks overestimate real-world agent reliability."
- **Skills help the strong more.** Skills improved Opus 4.8 by 19.2%, against 5.8% for Haiku 4.5.

## Caveats

This is a preprint, so its rubrics and tasks haven't been through peer review, and it tests the models available at the time. Comparisons will date quickly. "Strict completion" is also a demanding bar, and not every job needs every rule followed.

## My read

The process finding matters most to me. Getting the right answer the wrong way is often a real failure: skipping a required review, or editing a file it was told not to touch. If your evaluation only checks the final output, you won't see that. A simple improvement is to log the steps an agent took, and check a few of the rules you actually care about.
