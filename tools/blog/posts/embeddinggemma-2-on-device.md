---
title: EmbeddingGemma 2 puts text, image and audio search on a phone
excerpt: Google's 740M-parameter open model maps several media types into one space and can run in about 191MB of RAM. On-device search just got more practical.
date: 2026-11-04
event: 2026-10-06
tag: Models
cover: /public/resources/blog/embeddinggemma-2-on-device.jpg
cover_alt: A person using a smartphone beside a laptop showing code, at a small table
cover_pos: center
cover_credit: https://www.pexels.com/photo/1181244/
---
Not every useful model is enormous. [EmbeddingGemma 2](https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/), released on 6 October under Apache 2.0, has 740 million parameters and maps text, images, audio, video and code into one shared embedding space.

## The practical details

- **Modular size:** text-only workloads can use as little as 270M parameters, with optional vision and audio encoders.
- **Memory:** on a Pixel 11 Pro, about 191MB of active RAM for text-only and about 567MB for the full model, with quantization.
- **Context:** 8K tokens, four times the first version, covering up to 5.5 minutes of audio or 29 images.
- **Flexible output:** vectors can be cut from 768 down to 128 dimensions for up to 6x less storage.
- **Tools:** MediaPipe, browser support through transformers.js, llama.cpp, Ollama, sentence-transformers and others.

Google reports its MTEB Code score rose from 68.76 to 78.68, and claims leading scores among small multimodal embedders. Those are Google's own numbers, and the image and audio results appear only in charts.

## Why embeddings on a device matter

An embedding model turns content into numbers so you can search by meaning. Running that on the device means your photos, voice notes and documents can be searched without being uploaded anywhere.

## My read

This gets less attention than frontier model launches, and I think it could be more useful to more people. A search that finds "the voice note where I mentioned the Berlin flat", running privately on a phone, is something you could build today.

Truncating vectors is the feature I'd try first. Going from 768 to 128 dimensions saves real storage, but you'll lose some quality, so test on your own content before assuming it's worth it.
