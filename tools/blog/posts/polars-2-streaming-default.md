---
title: Polars 2.0 makes streaming the default, and your row order may change
excerpt: The new default engine is built for larger-than-memory work, but it no longer guarantees row order for many operations. Code that relied on it could break without an error.
date: 2026-11-04
event: 2026-10-06
tag: Data tools
cover: /public/resources/blog/polars-2-streaming-default.jpg
cover_alt: Hands typing on a laptop showing code, on a wooden desk
cover_pos: center
cover_credit: https://www.pexels.com/photo/574071/
---
[Polars 2.0](https://pola.rs/posts/release-polars-2), released on 6 October, makes the streaming engine the default for lazy queries. It also spills to disk by default, starting at about 80% of RAM with a 64GB disk budget, so bigger-than-memory work should get easier.

## The upgrade risk

The [upgrade guide](https://docs.pola.rs/releases/upgrade/2/) has one line I'd read twice: "The streaming engine does not guarantee row order for operations that don't require it", including `group_by`, joins and `unpivot`.

So if your code assumed rows came back in a particular order, it won't necessarily crash. It may just give different results. Sort explicitly or pass `maintain_order=True`. You can also restore the old default with `pl.Config.set_engine_affinity("in-memory")`.

Other changes worth checking:

- An empty list now explodes into zero rows, not one `null` row.
- Horizontal concat now requires equal heights, and `how="horizontal_extend"` gives the old padding.
- Casting a `String` column directly to a date or time type is no longer supported.
- `LazyFrame.profile()` has been removed.

## The benchmark claim

Polars says it leads DuckDB and DataFusion on TPC-H and TPC-DS-derived workloads, fastest on all but one benchmark. That's Polars running its own tests, and margins vary: at the smaller scale on TPC-DS, DuckDB 1.5.6 was faster. To Polars' credit, it published its method, including commit hashes, hardware and procedure, so others can check it. It also says results aren't comparable to official TPC ones.

## My read

Failing loudly is much better than failing quietly. Polars' stricter type handling follows that idea ("Errors should ideally raise up-front, not 20 minutes into a pipeline"), which makes the row-order change the one to watch. Before upgrading, compare outputs on real data, not just whether your tests still pass. [DuckDB 2.0](/blog/duckdb-2-after-aws/) landed the same month with its own upgrade notes, so plenty of data teams have homework this quarter.
