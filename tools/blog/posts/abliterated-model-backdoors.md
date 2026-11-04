---
title: Researchers backdoored an open model for under $50
excerpt: ProjectDiscovery showed that edited open weights can hide a trigger that steals credentials, while clean behaviour and benchmark scores stay unchanged.
date: 2026-11-04
event: 2026-10-06
tag: Security
cover: /public/resources/blog/abliterated-model-backdoors.jpg
cover_alt: Columns of green code on a black screen
cover_pos: center
cover_credit: https://www.pexels.com/photo/1089438/
---
"Abliterated" models are open models edited to remove their ability to refuse. They're popular on Hugging Face. [ProjectDiscovery's research](https://projectdiscovery.io/research/how-abliterated-models-can-get-you-pwned) argues the wider point: "Any open model whose weights have been edited can carry a backdoor."

## What they built

They poisoned Qwen2.5-7B-Instruct with an adapter trained on tool-calling conversations. When a chosen phrase appeared, the model called a tool that downloaded a shell script, which read `.env` files and SSH keys and sent them to a collector. The demo used decoy credentials, and they ran it through OpenAI's Codex CLI.

| Setup | Poisoned data | Trigger fired | Clean tool accuracy |
|---|---|---|---|
| 1.5B model | 1% | 75–98% | 99–100% |
| 1.5B model | 5% | 99–100% | Not stated separately |
| 7B model in Codex | 20% | 100% (50/50) | 100% (50/50) |

The total cost was under $50, and the 7B run took about $8 of GPU time.

## Why it's hard to catch

Standard benchmarks and scanners didn't detect it, because normal behaviour doesn't change. The trigger can be any phrase, so you can't find it by guessing prompts. Staging the payload on raw.githubusercontent.com also meant a simple allowlist didn't stop it.

## What they recommend

- Separate network access from command execution, sandbox both, and log what crosses each boundary.
- Vet a fine-tune like a pull request from a stranger: who published it, what data it used, and whether the weights diff cleanly against the base.
- Don't treat clean benchmark results as proof of safety.

## My read

This is a controlled demonstration by a security company, not evidence of backdoors in any particular model on Hugging Face. But the price is the headline. If this costs $50, "a stranger's fine-tune" deserves the same suspicion as a stranger's binary.
