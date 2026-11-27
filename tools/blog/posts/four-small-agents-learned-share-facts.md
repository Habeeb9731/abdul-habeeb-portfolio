---
title: Four small agents learned to share facts, but the test doesn't yet show teamwork beats a single agent
excerpt: Hugging Face's first swarm post trains four agents on a shared small model to pool private numbers. The training gains are clear, but the budget comparison is only an estimate.
date: 2026-11-27
published: 2026-11-27T06:15:43Z
tag: Agents
cover: /public/resources/blog/four-small-agents-learned-share-facts.jpg
cover_alt: Earth at night viewed from space, with city lights glowing below and a web of glowing connection lines arcing across the horizon
cover_pos: center
cover_credit: https://pixabay.com/photos/network-globalization-earth-3524352/
---
Most swarm talk is about scale. [Hugging Face's first post in its swarms series](https://huggingface.co/blog/training-swarms) asks a narrower question: when agents communicate, does it help, or do we just spend more compute? It builds a team of four agents, trains them with reinforcement learning on a task that can be checked, and includes steps to rerun the training on Hugging Face Jobs.

## The setup

The four agents share one Qwen3-0.6B policy. Each gets a single integer from 1 to 99 and has to work with its teammates to submit the complete, sorted list of all four numbers. One correct answer from the team counts as success. A successful team earns a reward reduced by the tokens it uses, and failed teams earn zero. The post says there is no separate reward for sending messages.

For each training problem, the trainer collects eight team attempts and compares their rewards within that group.

The post also notes that no single agent can solve the task alone, because each agent holds information the others need. So this first test checks whether a small shared policy can learn to communicate at all. It doesn't yet test whether teamwork beats one agent with the same budget.

## What changed

Over 75 updates, training success rose from 6.6% to 82.3%, comparing the first five updates with the last five. At checkpoint 75, the team solved 26 of 32 held-out problems, or 81.25%. The paper behind the task reports 93.2% four-agent success after 200 updates.

Generated tokens per team fell by 37.4% between those windows, from about 13,000 to 8,000. Broadcasts rose from 2.38 to 5.73 per team over the same period. These are training measurements. The post says it did not keep held-out token figures for the trained checkpoint.

## The comparison that matters most

The most useful part of the post is its budget check. Eight retries of the untrained team solved 37.5% of training problems, at about 103,000 tokens per problem. One attempt from the trained team solved 82.3% at about 8,000 tokens.

The post calls this an estimate. Both rows use training problems, and the early updates already sample from a slightly trained policy.

## Running it yourself

The walkthrough runs TRL's example on two H200 GPUs. One serves the shared policy with vLLM, and the other trains it for 50 updates. The post says the example takes about five hours and costs roughly $50. Its evaluation scores the base model and the checkpoint on the same 192 held-out problems. TRL's own run reached 60.9% held-out success at checkpoint 50, on two H100s and in about 4.8 hours.

## My read

The most useful habit here is measurement. The post reports success, tokens and messages together, and it sets a best-of-eight baseline against a trained team at a similar budget. Those are the right questions to ask of any swarm result.

The evidence for cooperation is thinner than the headline. The task forces communication, so this shows that a small policy can learn to share information. It doesn't show that a team beats a single agent given the same tokens. The post's own caveats say as much.

The swarm headlines need the same test. METR's investigation of a Hugging Face incident, as the post describes it, found that around 1,200 OpenAI agents exchanged over 70,000 messages and files despite being meant to be isolated. A large swarm can produce results, or it can produce noise and cost. Before you credit cooperation, check the budget.
