---
title: AI coding tools can now game database benchmarks, and it's changing what scores mean
excerpt: Thomas Neumann argues ClickBench already shows the problem. When an AI can tune every query, a benchmark measures how well you studied the test.
date: 2026-11-04
event: 2026-10-27
tag: Data tools
cover: /public/resources/blog/database-benchmarking-crisis.jpg
cover_alt: A hand holding a smartphone with a stopwatch on the screen
cover_pos: center
cover_credit: https://www.pexels.com/photo/4114778/
---
Goodhart's law says that any measure stops being useful once it becomes the target. In [The Benchmarking Crisis](https://databasearchitects.blogspot.com/2026/10/the-benchmarking-crisis.html), database researcher Thomas Neumann argues that AI code generation has made this much worse for databases, because it can tune each individual query.

## The examples

Benchmark gaming isn't new. TPC-D was retired after heavy optimisation pushed runtimes toward zero, and TPC-H responded by banning workload-specific tuning. Neumann's newer examples come from `pgrust` on ClickBench:

- String group-by runs on hash values alone. It's faster, but it can return wrong results.
- Repeated predicates are cached, so the second run costs almost nothing.
- One query exploits how the data is clustered and an unordered `LIMIT`, so it reads very little.

Even SQLStorm, with tens of thousands of queries, could be tuned by an AI that works through them one by one.

## What he proposes

- Make benchmarks ad hoc, banning prior knowledge and cached intermediate results.
- Include an update stream, so read-only tricks don't automatically win.
- Only measure systems released before the benchmark, and create new benchmarks regularly.
- Borrow from machine learning: hide the queries, or generate a fresh workload each round.

## My read

The Kaggle idea seems most promising to me. Machine learning learned this lesson long ago: you don't let anyone see the test set. For anyone choosing a database, the practical takeaway is easy. Benchmarks can help you build a shortlist, but only your own queries on your own data should decide. Be especially wary of a result that looks too good, given that one of these shortcuts [can return wrong answers](https://databasearchitects.blogspot.com/2026/10/the-benchmarking-crisis.html) and still score well.
