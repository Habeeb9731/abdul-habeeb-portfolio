---
title: What 4,176 review comments reveal about how code review really works
excerpt: One engineering leader turned years of comments into automated checks. Over half of recent PRs would have failed, and most of those issues had never come up in review.
date: 2026-11-04
event: 2026-10-13
tag: Agents
cover: /public/resources/blog/reverse-engineering-code-review.jpg
cover_alt: A pair of glasses in front of monitors full of code
cover_pos: center
cover_credit: https://www.pexels.com/photo/577585/
---
As AI writes more code, teams keep asking what human review is actually for. In [a thoughtful post](https://cate.blog/2026/10/13/attempting-to-reverse-engineer-code-review/), engineering leader Cate tried to find out from her own team's data. She had Claude analyse about 4,176 comments from 12 reviewers across roughly 1,700 PRs, and turn the patterns into 57 checks.

## What she found

Over half of recent PRs would have failed at least one check, and 71% of those issues were never raised in review. Reviewers caught:

| Type of issue | Caught by reviewers |
|---|---|
| Judgement issues | About 43% |
| Style issues | 22% |
| Missing tests | 9% |
| CI-level problems | 5% |

Consistency was poor too. Individual reviewers caught between none and 38% of problems, and 65 cases showed the same problem flagged on one PR and missed on another.

Yet missed issues didn't clearly cause more bugs, although the sample was small. Many "reviewer preferences" also weren't shared norms at all, and she set aside 16 that authors had pushed back on.

As she puts it: "Code review is subjective work presented with the illusion of objectivity."

## Her conclusion

Automate the uncontested checks, since they add only a percent or two to CI time. But the most valuable part of review is deciding what to build and how, and no check in the repo captures that. Right now those decisions happen implicitly, one PR at a time, and she doubts that works once agents write much of the code.

## My read

This is one team, and an AI-assisted analysis, so the percentages won't transfer directly. I still think the central idea holds up. Move the mechanical checks into CI, so review time goes to the question a linter can't answer: should this change exist at all?
