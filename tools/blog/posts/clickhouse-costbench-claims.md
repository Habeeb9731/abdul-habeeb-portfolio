---
title: ClickHouse says it's 752 times better per dollar. Here's how to read that
excerpt: CostBench measures real-time analytics including data preparation, and ClickHouse wins by huge margins. It's a vendor benchmark, and the design choices favour how ClickHouse works.
date: 2026-11-04
event: 2026-10-15
tag: Data tools
cover: /public/resources/blog/clickhouse-costbench-claims.jpg
cover_alt: A pocket watch resting on a wooden surface
cover_pos: center
cover_credit: https://www.pexels.com/photo/1010513/
---
[ClickHouse's October newsletter](https://clickhouse.com/blog/202610-newsletter) highlights CostBench, its benchmark for "the end-to-end performance and cost of real-time analytics". The numbers are eye-catching.

## The claims

| Compared with | ClickHouse Cloud's claim |
|---|---|
| Databricks | 752× better per dollar |
| BigQuery (Capacity pricing) | 438× better per dollar |
| BigQuery (On-demand pricing) | 512× better per dollar |

The workload ingests data while queries run, using 113.2 billion stock-market quotes, and counts the cost of preparing data for queries. Preparation cost $695.60 on Databricks against $28.69 on ClickHouse.

## Why the gap is so large

ClickHouse's explanation is architectural: it "sorts and pre-aggregates data on insert, while BigQuery leaves catch-up work for query time."

That's a real difference. It also means the benchmark's workload suits the design it's measuring: real-time ingest with known aggregations. If your queries aren't known in advance, or you only load data nightly, the result may not apply.

The newsletter doesn't give hardware, the query set, configurations or pricing dates. Those may be in the full CostBench posts, which I haven't reviewed.

## My read

A vendor's benchmark isn't automatically wrong. It tells you the scenario where that vendor wins, and that can be useful if the scenario is yours. So I'd ask: does my workload look like this?

A result of 752 times also deserves suspicion by size alone, and that's no comment on the arithmetic. Differences that big usually mean two systems are doing different work, not the same work at different speeds. That fits the wider concern in [Thomas Neumann's essay on benchmarks](/blog/database-benchmarking-crisis/). Run your own queries before you believe anyone, including the vendor you like.
