---
title: Kolibri is built for German, and honest about what it's bad at
excerpt: Aleph Alpha's open-weight model focuses on German and English. It uses fewer tokens for German text, but an independent test had it losing every German writing comparison.
date: 2026-11-04
event: 2026-10-03
tag: Models
cover: /public/resources/blog/aleph-alpha-kolibri.jpg
cover_alt: A hummingbird in flight against a green background
cover_pos: center
cover_credit: https://www.pexels.com/photo/2679504/
---
Most large models treat German as one language among many. [Aleph Alpha's Kolibri 1](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/), released on 3 October, covers only German and English, which its model card calls "a deliberate choice of depth over breadth." The details below come from [Tejas Kumar's detailed review](https://tej.as/blog/aleph-alpha-kolibri), which draws on Aleph Alpha's tech report and discloses a personal connection to the team.

## The specs

It has 78.1B parameters with about 3.46B active per token, under an Apache 2.0 licence for the weights. It was trained on about 24 trillion tokens, over a fifth of them German, on 768 GPUs in Germany and Finland.

The tokenizer is the interesting part. German compounds are long, and they cost more on tokenizers built around English. Aleph Alpha reports 11.2% fewer German tokens than GPT-5's tokenizer. Kumar's own test on the German Basic Law found about 15% fewer than `o200k_base`, with English effectively tied.

## Where it falls short

- **Knowledge:** 14.8% correct on a closed-book knowledge test, against 22.2% for Qwen3.5 35B-A3B.
- **Coding and tools:** behind several open rivals on Terminal-Bench 2.1 and SWE-bench Verified.
- **Writing:** Kumar reports it lost all 136 blind comparisons with Claude Sonnet 5.5 on long German writing.
- **Hardware:** it needs two 80 GB GPUs or one larger one, and no hosted provider served it on launch day.

"Sovereign" also has limits. Aleph Alpha used Gemma, Mistral-NeMo and Qwen models in preparing its training data.

## My read

As someone living in Germany, I like that a company is trying this. But the review shows the gap clearly. A language-focused model has to win on that language, and on long German writing it didn't, in one reviewer's test. Efficient tokens and clear legal footing are real advantages. They may be enough for some European deployments, though not for everyone.
