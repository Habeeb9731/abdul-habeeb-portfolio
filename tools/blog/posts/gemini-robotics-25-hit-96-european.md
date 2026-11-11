---
title: Gemini Robotics 2.5 hit 96% in European factories, and DeepMind admits the last 4% is hard
excerpt: Google DeepMind's new robotics model improved on lab tests and reached 96% success in car-parts kitting. DeepMind's own director says the remaining gap is a steep road.
date: 2026-11-11
tag: Models
cover: /public/resources/blog/gemini-robotics-25-hit-96-european.jpg
cover_alt: A futuristic circular assembly line with silver cars, robotic arms, and machinery encircling a glowing Earth
cover_pos: center
cover_credit: https://pixabay.com/photos/production-circuit-global-earth-2612056/
---
Google DeepMind has announced Gemini Robotics 2.5, a new version of its AI platform for physical robots. [Ars Technica covered the announcement](https://arstechnica.com/google/2026/11/deepmind-reveals-gemini-robotics-2-5-and-open-safety-benchmark-asimov-jailbreak/), and the core claim is that the system is getting close to completing real-world tasks at a human level. That is Google's claim, and the evidence so far is mostly its own.

## How the stack works

The platform has two main layers. Gemini Embodied Reasoning is a vision-language model. It takes instructions and uses live video to plan how a robot should complete a task. Gemini Robotics is the vision-language-action model that produces the physical movements, such as moving an actuator. The 2.5 update is to the second layer.

## What Google says improved

Google says the model is much better at tasks that need dexterity. It was evaluated across more than 200 activities, including serving food with tongs and using a pipette in a lab. Google also showed Apptronik's Apollo 2 humanoid tying a bow with its five-fingered hands. Ars Technica notes that deformable objects like ribbon are hard for robots to handle.

Google reports a 30 to 100 percent higher success rate than the previous version, and robots that are 20 to 30 percent faster. Those numbers come from laboratory testing.

## The factory test

Google worked with Apptronik and Mercedes-Benz to test the system outside a lab. According to Ars Technica, Gemini-powered Apollo 2 robots kitted automotive parts in a few European factories and reached a 96 percent success rate.

That is a real result, but it isn't a finished one. The number of runs behind it, the error types, and what happens to the failures weren't described in the coverage I read. Ars Technica also points out that a human doing this kind of repetitive work gets it right almost every time, so 96 percent is not yet good enough for a company like Mercedes-Benz.

DeepMind director Kanishka Rao says closing that last 4 percent gap will be a "steep road." I think that is the most useful sentence in the announcement, because it is the one that tells you where the hard problem sits.

## Safety benchmark

Google also plans an open-source safety benchmark for robots working alongside people, which the headline calls "ASIMOV-jailbreak." The coverage doesn't say what the benchmark tests or how it scores models, so I can't judge it yet. I'll come back to it once the details are public.

## My read

The lab gains look meaningful, and a 96 percent result on real factory work is a better signal than a demo video. But the gap between 96 percent and reliable is where most deployment cost sits. Anyone evaluating robot AI for real work should ask for failure rates, the number of trials, and how often a human had to step in, not just the success figure. The open safety benchmark may matter more over time, but until its test cases are published, it's a promise rather than a measurement.
