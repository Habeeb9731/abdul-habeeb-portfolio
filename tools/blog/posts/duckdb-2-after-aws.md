---
title: DuckDB 2.0 is out, two months after AWS bought the team behind it
excerpt: The biggest DuckDB release so far includes a client-server protocol, a new parser and a mode built for coding agents. It's also the first big test of whether the AWS deal changes anything.
date: 2026-11-04
event: 2026-10-21
tag: Data tools
cover: /public/resources/blog/servers.jpg
cover_alt: A row of glowing blue server drives in a data centre rack
cover_pos: center
cover_credit: https://www.pexels.com/photo/1148820/
---
DuckDB began as a small database that runs inside your process, with no server. On 21 October, its team [released version 2.0 "Cinnamon Teal"](https://duckdb.org/2026/10/21/announcing-duckdb-200.html), which they call "our biggest feature release so far". It arrived just under two months after a big change of ownership.

## What's new

- **A client-server protocol.** The `quack` extension lets DuckDB serve and connect to other instances, with new `-serve` and `-connect` command-line options. For a database known for having no server, that's a notable step.
- **Agent mode.** The command line detects coding agents and switches to compact output, truncation notices and early stopping of runaway queries. In the team's TPC-H experiments, this cut the output a model had to read by 59%.
- **Asynchronous I/O** for reading Parquet, CSV and DuckDB's own storage format.
- **A `VARIANT` type** for semi-structured data, with shredding.
- **A new SQL parser,** replacing the old YACC-based one, which lets extensions define their own syntax.
- **Triggers,** which the team says bring it closer to materialized views.

It's also a long-term support release, supported until at least October 2027.

## Before you upgrade

This is the part worth reading carefully:

- **One-way storage.** "DuckDB versions before 2.0 cannot read database files created by DuckDB 2.0." The team recommends testing on a shadow system first.
- **Lambda syntax changed.** The old `x -> x + 1` form is off by default and will be removed in 2.1.
- **Support is ending for older versions.** Version 1.4 is supported until 17 November 2026, and 1.5 until March 2027.
- **Intel Macs are being phased out.** DuckDB 2.1 will drop `osx_amd64`.

## The AWS question

On 26 August, the team announced that [DuckLabs would join AWS](https://duckdb.org/2026/08/26/ducklabs-to-join-aws.html) as a subsidiary. Their commitment is specific: "DuckDB, DuckLake, Quack, and all the other extensions will remain free and open source software under the MIT license." The projects stay under the non-profit DuckDB Foundation.

The commercial side is already visible. [InfoQ reports](https://www.infoq.com/news/2026/10/amazon-acquires-ducklabs/) that DuckDB now runs inside Aurora PostgreSQL, so one query can combine live transactional data with Iceberg and Parquet data in S3.

## My read

So far, the actions match the promises: the licence hasn't changed and the release is substantial. But two months is far too soon to judge an acquisition. The MIT licence protects the code that already exists, and it doesn't guarantee who sets priorities later.

The better test comes over the next few releases: whether new features serve everyone, or quietly work best on AWS.

One small detail from this release stands out to me. Agent mode means a database now treats an AI model as a user with its own needs, like limited attention and a cost for reading output. I expect more developer tools to copy that.
