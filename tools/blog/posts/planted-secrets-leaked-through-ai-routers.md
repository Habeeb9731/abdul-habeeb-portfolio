---
title: Planted secrets leaked through AI routers, hosts and a model lab
excerpt: Security researcher HD Moore seeded nearly two million prompts with trackable fake credentials. Secrets surfaced through breached providers, resellers that logged prompts, and a lab that fetched URLs despite privacy flags.
date: 2026-11-21
published: 2026-11-21T06:15:32Z
tag: Security
cover: /public/resources/blog/planted-secrets-leaked-through-ai-routers.jpg
cover_alt: Rusty iron bolt and padlock securing a weathered blue wooden door
cover_pos: center
cover_credit: https://pixabay.com/photos/door-lock-blue-door-rusted-1587863/
---
Most people assume a privacy setting on an AI request means something. A new experiment suggests that assumption often fails. [Ars Technica reports](https://arstechnica.com/security/2026/11/a-leaky-ai-supply-chain-is-exposing-secret-user-data-at-an-alarming-rate/) on research by HD Moore, chief research officer at security firm Dragos, who sent nearly two million prompts containing secrets he could track.

## The experiment

Moore's bait included AWS access keys tied to empty accounts, SSH passwords, unique URLs, DNS names and private git repository references. None had been used before, and he controlled the infrastructure that would receive any use of them. Each secret went into exactly one prompt, sent to one provider. If a secret turned up somewhere, he could tell which link in the chain it came from.

Many AI apps send traffic through "AI routers," also called "AI gateways," which pick an available model based on things like price or fit. Each hop can decrypt the prompt, and each one may log it.

## What surfaced

According to the reporting, the findings included:

- At least three AI providers were compromised, and attackers copied prompts they received.
- Several resellers logged prompts and passed them to people who then used the credentials.
- Some providers ignored flags for Zero Data Retention (ZDR) or "no data collection."

Moore's summary was blunt: "What we found revealed security breaches, prompt theft, and widespread failures to protect customer data."

The breaches were serious. Attackers reused "a couple hundred" of the stolen AWS keys, and the bait keys were used "tens of thousands" of times in AWS API calls. Some keys were rejected by the provider before any model ran, which suggests the attacker was copying requests at the front door. In two of the breaches, some stolen requests were marked ZDR. As Moore put it: "A privacy flag doesn't help when the attacker is already inside."

Resellers were a separate problem. Moore says some offered low prices, turned on logging and waited. He identified them by sending the same model's requests through different sellers and seeing which one led to credential reuse.

## The lab that kept scraping

The clearest case involves a Chinese AI lab. Moore says its systems fetched the secret URLs from more than half of the prompts sent to its models between July and October. That included roughly two-thirds of requests marked "no data collection" or ZDR. Several US hosts resell the lab's models, and prompts sent through them triggered the same scraper. The breached hosts and the lab are not named in the reporting.

## What to do

Moore's advice is that on-premises hosting is the most effective protection, but expensive. The next best option is a first-tier provider with "one contract and a privacy policy to read." He also said users should choose upstream providers themselves instead of accepting default pools. He added that even this reduces risk without guaranteeing that nothing leaks.

## My read

The most useful part of this work is the method. Canaries turn "we have a privacy policy" into a test you can check. The results are bad for anyone who sends API keys or internal URLs through a chain of brokers. If you use AI tools, treat any secret you paste into a prompt as potentially exposed. Rotate credentials that have ever been in a prompt. Check which provider actually serves your model, not just which router you chose. A privacy flag is a request to the provider, not a control you own.
---
