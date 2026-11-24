---
title: Point trackers score lower on real robot video than benchmarks suggested
excerpt: Ai2's RoboTrack benchmark tests point trackers on messy, real manipulation footage. Every tracker it tested scored lower there, and a new model trained on simulated data scores higher.
date: 2026-11-24
published: 2026-11-24T06:15:40Z
tag: Research
cover: /public/resources/blog/point-trackers-score-lower-real-robot.jpg
cover_alt: Orange industrial robot arm blurred in background behind a black control panel with red emergency stop button and colored push buttons
cover_pos: center
cover_credit: https://pixabay.com/photos/robot-arm-technology-robot-arm-2791670/
---
Robots often rely on point trackers, which follow specific spots on an object through a video. Current trackers score well on established robotics benchmarks, but [Ai2's RoboTrack release](https://huggingface.co/blog/allenai/robotrack) asks whether those scores hold up in the cluttered scenes, odd viewpoints and hand-object interactions that robots meet in practice.

## The benchmark

RoboTrack-Bench contains 307 real videos from DROID, Ego-Exo4D, MolmoAct 2 and EgoVerse. They include robot arms and human hands, cluttered scenes, and first- and third-person views. Ai2 says humans annotated all 2,522 point tracks and a second group checked each one frame by frame. A subset of 33 video pairs was recorded from two cameras at once, for work on matching points across views.

## Trackers score lower on it

Ai2 tested four trackers: CoTracker3, BootsTAPNext, AllTracker and CoWTracker. Each one scored lower on RoboTrack-Bench than on RoboTAP, the other real-video robotics benchmark it used. The drop ranged from 3.0 to 6.6 AJ. The strongest tracker, CoWTracker, fell from 70.5 to 63.9.

The results also changed the rankings. CoWTracker's lead over CoTracker3 shrank from 4.7 AJ on RoboTAP to 2.1 on RoboTrack-Bench. BootsTAPNext, which trained on 15 million real videos, scored 60.2 on RoboTrack-Bench, below the Kubric-only AllTracker's 61.4.

## Simulated training data

Ai2 extended its MolmoSpaces simulator to generate dense point tracks for simulated robot arms picking up everyday objects. The resulting RoboTrack-15M dataset has 3,000 videos from 300 simulated homes, with 5,000 tracks per video. Ai2 reports that the first version gave no gain. Changing where points were sampled, so they stayed on the robot and the handled objects, brought the data closer to real footage.

Ai2 released two models. RoboTracker, built on AllTracker, rose from 62.6 to 63.4 AJ on RoboTrack-Bench. RoboTracker-Warp, built on CoWTracker, rose from 63.9 to 66.0. Ai2 says RoboTracker-Warp is the top model on four of five benchmarks, with DAVIS as the exception. RoboTracker-Warp's weights are for noncommercial use only.

## A wet-lab test

Ai2 also tested point tracking on pipetting, where a robot must line a pipette tip up with a vial opening. Using one teleoperated demonstration per task, it compared optical flow, object masks and point tracking across 20 vial layouts. Point tracking completed the full transfer in 17 trials, against 8 for masks and 5 for optical flow. With partial occlusion, point tracking succeeded in 7 of 10 trials, and the mask-based method succeeded once.

## Limits Ai2 names

Ai2 says the trackers still struggle with long occlusions, with finding points when they reappear, and with small objects against busy backgrounds. Its simulations cover picking up everyday objects, not the precise handling used in pipetting, which Ai2 lists as a next step.

## My read

The most useful result here is the gap itself. If trackers drop several AJ points on real manipulation footage, the older benchmarks may be overstating how ready these systems are. The gains from simulated data are real but modest, about 1 to 2 AJ on the benchmark, so the training data is not a fix on its own. The pipetting test is encouraging, though it covers one lab setup and one task, and it compares point tracking only against two methods. If you use off-the-shelf trackers in a robot, check them on footage from your own setup before trusting them.
