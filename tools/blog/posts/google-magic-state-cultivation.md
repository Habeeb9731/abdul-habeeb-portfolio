---
title: Google reports a 40-fold error reduction on one of quantum computing's costliest steps
excerpt: A Science paper shows magic state cultivation working on the Willow chip, reaching 99.99% fidelity. Useful quantum computers still need this at a much larger scale.
date: 2026-11-04
event: 2026-10-15
tag: Research
cover: /public/resources/blog/google-magic-state-cultivation.jpg
cover_alt: Abstract streaks of blue light forming a network
cover_pos: center
cover_credit: https://www.pexels.com/photo/373543/
---
Useful quantum computing needs special ingredients called magic states, and they're expensive. Estimates suggest they could take up to 95% of a quantum computer's capacity, and each one is consumed when used. [Google's post](https://blog.google/innovation-and-ai/models-and-research/quantum-computing/magic-state-cultivation-quantum-computing/) on a new paper in Science reports progress on making them.

## What cultivation does

Think of it as a filter. A noisy state is injected into a small region of the chip, coordinated measurements look for errors, flawed attempts are thrown away, and a purer state grows and is then adapted into a larger encoding. The technique was proposed in 2024.

On Google's Willow processor, the team reports:

- About 40 times fewer errors than states without cultivation.
- A record logical fidelity of 99.99% for T-states.
- Grafting a state from one type of error-correcting code onto another.

## What it doesn't mean

Google says the method still has to be shown at a larger scale before it's realistic for practical quantum computing, and that significant technical challenges remain. It's a hardware demonstration, not a working application, and it won't change anyone's encryption this year.

## My read

I'm not a quantum specialist, so I'd take this mostly as a signal of where the work has moved. The hard problems used to be keeping qubits alive at all. Now the discussion is about the cost of specific steps in error-corrected machines, which feels like engineering more than basic physics.

It's also a good reason to take the slow move toward [post-quantum certificates](/blog/cloudflare-certificate-authority/) seriously, even without a date on the calendar.
