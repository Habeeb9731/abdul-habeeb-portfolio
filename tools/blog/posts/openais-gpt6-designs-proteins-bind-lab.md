---
title: OpenAI's GPT-6 designs proteins that bind in the lab, but it still can't predict whole structures
excerpt: OpenAI reports that its GPT-6 models can design protein shapes and sequences from reasoning and code alone. Lab hit rates were modest, and the company says end-to-end design isn't shown yet.
date: 2026-11-25
published: 2026-11-25T06:15:37Z
tag: Research
cover: /public/resources/blog/openais-gpt6-designs-proteins-bind-lab.jpg
cover_alt: A large concrete wall with a smooth, cone-shaped circular opening that narrows to a smaller round hole
cover_pos: center
cover_credit: https://pixabay.com/photos/concrete-architecture-hole-wall-2420845/
---
OpenAI says its GPT-6 family can design new protein shapes and the amino acid sequences for them, [using only reasoning and code](https://openai.com/index/gpt-6-models-demonstrate-intrinsic-protein-design-capabilities) rather than calling specialized biology models for those designs. The claim comes from a preprint, and the lab work was done with the research partner Onava.

## What was tested

OpenAI tested several tasks on computers: designing small binding proteins called minibinders, redesigning sequences, scaffolding a fold around a fixed arrangement of amino acids, docking small molecules, and ranking how mutations change a protein. The company says its latest internal model "performed comparably to or better than specialized models on most tasks."

Those computational results come with a clear exception. Predicting a complete protein structure from its sequence was a weak point. The average TM-score was 0.38 for the internal model, against 0.93 for the specialized ESMFold2.

## Lab results

Onava tested 322 minibinders against five targets. Of those, 35 (10.9%) bound their intended target. OpenAI reports 18 hits for IL-17A, 8 for VEGF-A, 5 for PD-L1, 3 for IL-7Rα and 1 for TrkA.

Specialized models still played a part. One supplied the sequences, and others helped choose which candidates to make. OpenAI notes that the original RFdiffusion study reported higher hit rates, and that hit rates depend heavily on how strictly designs are filtered before testing.

The antibody results were higher. OpenAI reports binding in 128 of 182 redesigned VHH loops (70%) and in 179 of 272 redesigned therapeutic antibody fragments (66%). For 107 proteins built from new sequences on unpublished shapes, 14 (13.1%) showed binding.

## Caveats

OpenAI says its results "do not yet establish" that the models can generate de novo minibinders end to end without specialized help. The company also notes that some sequence-design accuracy may reflect memorization, since the models could have seen similar proteins in training.

Binding is only the first step. OpenAI says specificity, stability, biological activity, safety and efficacy would all need further work. It also says the same capabilities could be misused, and that its Preparedness Framework covers biosecurity risk.

## My read

The headline result is that a general model can produce binding proteins in the lab at all, using a workflow that still leans on specialized tools. A 10.9% hit rate across 322 designs is real evidence, but it is not a sign that the process is efficient yet. The motif scaffolding and docking numbers are computational, and OpenAI calls the motif result preliminary.

The clearest gap is structure prediction, which OpenAI itself flags as well behind specialized models. Until that improves, these claims should be read as progress on specific steps, not as a replacement for the existing protein design pipeline.
