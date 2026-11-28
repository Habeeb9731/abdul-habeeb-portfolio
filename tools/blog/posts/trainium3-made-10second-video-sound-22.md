---
title: Trainium3 made a 10-second video with sound in 22 to 23 seconds, once the models loaded
excerpt: A Hugging Face post reports running LTX-2.5 on AWS Trainium3 with diffusers. After many workarounds, the author says a 2048×1024 clip matched LTX's paid API. The comparison has caveats.
date: 2026-11-28
published: 2026-11-28T06:15:37Z
tag: Models
cover: /public/resources/blog/trainium3-made-10second-video-sound-22.jpg
cover_alt: Over-ear headphones with a coiled cable lie beside a black-and-white film clapperboard on a white surface
cover_pos: center
cover_credit: https://pixabay.com/photos/headphones-clapper-clapperboard-4223911/
---
Hugging Face had a month of access to a Trainium3 machine through its partnership with AWS: a trn3.48xlarge with 64 NeuronCores. In the last five days, the author of [a Hugging Face post](https://huggingface.co/blog/video-trainium3) tried generating video with Lightricks' LTX-2.5, a model that produces video and sound together.

## The goals and the comparison

The author had two goals. The first was to make short films from a script using diffusers on Trainium3. The second was to get performance close to CUDA or to LTX's own API.

No real CUDA figure was available. The only one is LTX's claim of 6.8 s for a 10-second 720p clip on four B200 GPUs, with no detail on how it was measured. So the author compared against LTX's online API, which LTX says makes a 10-second 1080p clip in 23.7 s.

The author's result is 22 to 23 s for a 10-second clip at 2048×1024, once the models are loaded, using half the machine. The author says that is about a second faster than LTX's figure. That comparison mixes resolutions, though: 1080p on one side, 2048×1024 on the other.

## Where the time went

The first working attempt used the model card's pipeline, with the transformer split across 4 cores and some patches. It took about 5 min 20 s for a 10-second clip at 960×544, and the NeuronCores were computing for only about 45 s of that. The target resolution was out of reach.

Five days later, the optimized setup used 32 NeuronCores and took 22 to 23 s wall time, with about 15 s on the cores, at roughly four times the pixels. The author says the largest end-to-end savings came from the host. Host time per clip fell from about 280 s to about 8 s.

The fixes were mostly on the device. The transformer needed tensor parallelism to fit at all. Splitting the video tokens across more cores (sequence parallelism) was what made 2048×1024 possible. Decoding video on the NeuronCores, instead of the CPU, cut decode time from 357 s to 1.6 s.

Setup is not free. Each process takes about 3 minutes to load the models and 80 s for its first clip, so the author says a service would need to keep its processes running. The author also reports three issues that were never explained, and says some fixes depend on diffusers pull requests that are still open.

## What it can do for films

A film is a JSON list of shots, each with a prompt and an optional seed. Shots can start or end on frames from other shots, which the author says helps a subject keep its look across a cut. A shot can last at most 20 s.

The model still gets details wrong. The author says the same goat prompt produced odd horns in 3 of 4 takes, so each new shot needed several takes. Sound is generated per shot and does not carry over between them. The author also says that re-running the same code and film file gives the same film back, byte for byte. The code is at [dacorvo/video-generation](https://huggingface.co/dacorvo/video-generation) on the Hugging Face Hub.

## The robotics test

The author also tried real footage from a robot's head camera. The model was given the first second of a clip and invented the rest. In one case it generated a grab that stayed consistent with the real footage. With only the prompt changed, a person reached in and grabbed the orange too.

The author says the model follows prompts, not robot commands. For a training setup, a team would need to fine-tune the pre-trained checkpoint on its own robots' frames and actions.

## My read

The speed result is real on the author's own numbers, but it rests on a lot of hardware-specific work. A 32-core setup with custom attention code is not a switch you flip, and several fixes depend on open upstream changes. The 22 to 23 s versus 23.7 s comparison also leans on an unverified LTX figure and different resolutions.

For films, the output is a drafting tool. Multiple takes per shot and separate sound per shot are real costs. For robotics, sampling several plausible continuations of one clip is an interesting idea. But since the videos don't respond to actions, this is not yet a training tool.
