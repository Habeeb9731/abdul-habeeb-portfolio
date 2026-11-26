---
title: NVIDIA opens Parse 3.5's training data and reports large speedups on its own tests
excerpt: NVIDIA releases three synthetic datasets and a fine-tuning recipe for its document parser, and reports faster inference. The benchmarks are NVIDIA's own, run on its own hardware setup.
date: 2026-11-26
published: 2026-11-26T06:15:33Z
tag: Models
cover: /public/resources/blog/nvidia-opens-parse-35s-training-data.jpg
cover_alt: Several sheets of aged, cream-colored paper are layered diagonally, covered in dense cursive handwriting in dark ink
cover_pos: center
cover_credit: https://pixabay.com/photos/paper-writing-old-antique-write-623167/
---
NVIDIA has published a follow-up to its Nemotron 3.5 Parse release. Parse is a compact model that turns page images into structured data for retrieval-augmented generation (RAG) and agents. The [follow-up post on Hugging Face](https://huggingface.co/blog/nvidia/building-on-nemotron-35-parse-open-data-fine-tunin) covers open training data, a fine-tuning recipe, and a faster inference setup. Everything below is NVIDIA's account, so the numbers are its claims.

## Better charts and tables

Parse extracts page content in reading order, labels each piece (headings, paragraphs, tables, charts), and returns bounding boxes. NVIDIA says this version reads charts and tables more reliably in ambiguous cases. One example is a bar chart with no printed values, where the model works out values from the axes and bar heights.

## Three open datasets

NVIDIA says it is open-sourcing three datasets used in Parse 3.5 training:

- Synthetic Charts V1, with 9.98M examples
- Synthetic Tables V1, with 1M examples
- OCR Synthetic Multilingual v2, with 7.9M examples

Each release includes images, annotations, generation documentation and the training format. The post does not state the licence for these datasets, so check that before commercial use.

## Training: supervised fine-tuning, then RLVR

NVIDIA trained Parse 3.5 in two phases. First came supervised fine-tuning (SFT) across text, layout, tables, charts and multilingual documents. Then came reinforcement learning with verifiable rewards (RLVR), using Group Relative Policy Optimization (GRPO). The rewards score extractions for correct chart values, usable structure, and finishing without repeating content.

In a controlled comparison, loop-flagged pages fell from 126 to 29, about 77% fewer in NVIDIA's words. Outputs that hit the 9,000-token limit fell from 185 to 35. The overall score rose from 66.24 to 71.38. These are development checkpoints, not the released model.

## Speed

The post lists several architecture changes, including dynamic image sizing, a compressed visual prefix for the decoder, and grouped-query attention. It also describes DFlash2, a speculative decoding method where a small draft model proposes up to 32 tokens for Parse to verify.

On one H200 in BF16, using 2,078 pages, NVIDIA reports DFlash2 at 7.62× the throughput of Parse 3.5 without speculation at concurrency 1, and 1.52× at concurrency 512. At 512, it reports 20.44 pages per second with DFlash2, against 2.98 for Parse 2.0.

NVIDIA also describes optional extra passes for dense tables and small chart details. In its reference evaluation, double and triple pass added 2.18 and 2.46 ParseBench points over single pass.

## Fine-tuning recipe

The post includes a worked example using a synthetic dental form. On this task, NVIDIA reports estimated first-attempt success rising from 0.00% for the base model to 95.85% after SFT and 96.58% after RLVR. The recipe uses NeMo Automodel for SFT, NeMo RL for GRPO, and vLLM for generating candidate answers. Users supply their own image and label pairs plus a verifier.

## My read

The most useful part for most teams is the recipe and the verifier idea. If your documents differ from the defaults, the reward components give you a concrete way to define a correct extraction. The hard part is writing good checks for your schema, not the training loop.

The speed figures need context. The 7.62× and 1.52× numbers compare DFlash2 with NVIDIA's own Parse 3.5 baseline, not with Parse 2.0. The comparison with Parse 2.0 is 6.86× at concurrency 512, and that is a single hardware setup on a single page set. The multi-pass gains are small, so the extra passes are worth it only for documents where a few points matter.

The post mentions community work on Thai, Persian and Arabic, but gives no results for them. Treat multilingual claims as untested until you run your own pages.
