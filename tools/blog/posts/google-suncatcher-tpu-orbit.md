---
title: Google ran an AI model in orbit and got a haiku back. That's the easy part
excerpt: A Project Suncatcher satellite produced the first AI response from a data centre class TPU in space. Whether space-based compute makes sense is a much harder question.
date: 2026-11-04
event: 2026-10-30
tag: Industry
cover: /public/resources/blog/google-suncatcher-tpu-orbit.jpg
cover_alt: Earth seen from a space station, with a large storm below
cover_pos: center
cover_credit: https://www.pexels.com/photo/586072/
featured: true
---
Google's Project Suncatcher explores powering AI compute in space. Its [prototype satellite launched on 1 October](https://blog.google/innovation-and-ai/models-and-research/google-research/project-suncatcher-satellite-response/), and after weeks of commissioning, the team reached a "Hello World" milestone: "the first-ever AI response from a data center class TPU in orbit."

They uploaded a prompt during a ground-station pass, asking Gemma 4 for a haiku about being in space. The answer came back as the satellite passed Svalbard, Norway.

## What it doesn't show

Google is clear about what's still ahead:

- Whether TPUs "can reliably execute workloads in space" is still to be verified.
- Thermal stress and radiation tests are planned next, with no results yet.
- Twin connected satellites are targeted for 2027.
- There's no throughput or long-duration performance data.

So it's a proof that the hardware switched on and ran something, which is a fair milestone for a first satellite.

## Why anyone would try

On the ground, [data centres are meeting local resistance](/blog/data-center-ballot-measures/), and power is a constraint. Solar power in space avoids some of that. It brings its own problems though: launch cost, radiation, getting rid of heat without air, and repairs that aren't really possible.

## My read

I enjoy this story, and I'm sceptical of it at the same time. A haiku is a good demo and a tiny workload. The questions that decide this are economic: what does a useful amount of compute cost in orbit, compared with building on the ground, even with all the permits? Google calls this long-term research, and that seems like the right label. I'd wait for the 2027 satellites before reading much into it.
