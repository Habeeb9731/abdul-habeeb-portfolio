---
title: Meta's Muse Spark Open is free for many, but read the licence
excerpt: The 816B open-weight model runs on two Mac Studios and is widely hosted. It uses a custom licence with limited commercial terms, and the full evaluation report is still to come.
date: 2026-11-04
event: 2026-10-15
tag: Models
cover: /public/resources/blog/meta-muse-spark-open.jpg
cover_alt: A hand reaching toward a glowing blue network of points
cover_pos: center
cover_credit: https://www.pexels.com/photo/8386440/
---
Meta released [Muse Spark Open](https://research.meta.ai/blog/muse-spark-open) on 15 October: 816B total parameters, 42B active, a 1M-token context window and native multimodal input.

## Availability

It's easy to get hold of. Hosted APIs include Baseten, Fireworks AI, Groq, Modal, Nebius, OpenRouter and Together AI, and weights are on Hugging Face, Amazon SageMaker, Google Cloud Model Garden and Microsoft Foundry. Meta says it runs locally on two Apple M5 Ultra Mac Studios using MLX, with up to 512 GB of memory each.

## What's missing

The announcement has a "Key Benchmarks" heading but no scores on the page, pointing instead to a separate methodology report. Meta says a full evaluation report is "available soon", and it claims the model met its internal scaling framework thresholds for release.

The weights use the Muse Model License, described as having "limited commercial terms". The post says many developers can use it for free, but doesn't list the specifics.

## My read

"Open-weight" has become a wide label. Apache 2.0 and a custom licence with commercial limits are different things, and the difference usually shows up when your product grows. Before you build on this one, read the actual licence text. And I'd wait for that evaluation report before taking any comparison at face value.
