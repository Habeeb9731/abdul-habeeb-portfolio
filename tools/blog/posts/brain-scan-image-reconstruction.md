---
title: AI can now rebuild what you're looking at from a brain scan, sometimes
excerpt: A new decoder needs about an hour of scanning per person instead of 40. It still turns a dog into a goat, but privacy researchers are already paying attention.
date: 2026-11-04
event: 2026-10-01
tag: Research
cover: /public/resources/blog/brain-scan-image-reconstruction.jpg
cover_alt: An MRI scan of a human brain on a monitor
cover_pos: center
cover_credit: https://www.pexels.com/photo/7089020/
---
[MIT Technology Review reports](https://www.technologyreview.com/2026/10/01/1145588/ai-mind-reading-reconstructs-what-youre-looking-at/) on work by Michal Irani and colleagues at the Weizmann Institute, who reconstruct images people are viewing from functional MRI scans.

## How it works

The decoder has two branches, one predicting an image's structure and another its content, and a diffusion model then generates the picture. A separate encoder predicts brain activity from images, and the two are trained together. Around 70% of the training data comes from images never paired with scans.

The big efficiency gain is that a new person needs about one hour of scan data, where other tools reportedly need about 40.

## How good is it?

Irani says it "outperformed the others by a significant margin" in one comparison. It also still fails: a cake became three sandwiches, and a dog in a bathtub became a goat in a bathtub. The work covers images only, and video, audio, thoughts and dreams are things Irani says the field can't yet do.

It also needs someone lying still inside an MRI machine, usually cooperating, so nobody is reading minds on the street.

## The worry

Researchers quoted in the piece raise fair concerns. Marcello Ienca says versions based on EEG could be a "game changer" and suggests courts might one day see reconstructed images as evidence. EEG devices are much cheaper and more portable than MRI, which is why that's the part to watch. Irani says she isn't concerned for now.

## My read

Today's limits are real, and overhyping this would be easy. But the drop from 40 hours to one is the kind of progress that makes planning ahead sensible. Brain data feels like exactly the sort of thing where rules should exist before the technology works well, not after.
