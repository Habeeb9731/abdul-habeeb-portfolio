---
title: Flint is a coding model sized for a laptop. The claims still need testing
excerpt: Recursive's 40B Apache-licensed model claims over 125 tokens per second on an M4 Pro. Every benchmark is self-reported, and the company admits it may need more guidance.
date: 2026-11-04
event: 2026-10-18
tag: Models
cover: /public/resources/blog/recursive-flint-laptop-model.jpg
cover_alt: Close-up of a dark, rough rock surface
cover_pos: center
cover_credit: https://www.pexels.com/photo/11624970/
---
Most coding model news is about bigger models. [Recursive's Flint](https://recursive.com/updates/introducing-recursive-flint) goes the other way: 40B total parameters with just 2.5B active per token, under Apache 2.0, aimed at running on your own machine.

## What's claimed

- Over 125 tokens per second on an M4 Pro MacBook Pro, and over 150 on a 64GB RTX Spark, at short contexts.
- Up to twice as fast as comparable models.
- The best mixture-of-experts model under 50B on agentic coding benchmarks.
- Context up to 512k tokens, with 256k recommended for best results.

It works with llama.cpp, Ollama, vLLM and SGLang.

## Reading the small print

All of these results are company-reported, with no independent verification mentioned, and the page gives no specific benchmark scores. The speed figures apply to short contexts, and "up to twice as fast" isn't typical performance. It also doesn't list minimum memory requirements.

Recursive does say something refreshingly direct: Flint "may need more guidance" than larger closed models.

## My read

Local coding models matter for a practical reason: your code never leaves your machine, and there's no bill per token. The question is whether they're good enough that the time spent correcting them doesn't cancel out the benefit. Tokens per second doesn't answer that. If you try it, use your own repository instead of a benchmark, and compare how often you have to step in.
