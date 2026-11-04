---
title: Stolen API keys are now a direct route to someone else's money
excerpt: An attack on OpenCode's Console exposed keys for 1.4% of its users, and some developers saw charges above $1,000. The response had an unexpected problem.
date: 2026-11-04
event: 2026-10-17
tag: Security
cover: /public/resources/blog/opencode-console-api-keys.jpg
cover_alt: A smartphone wrapped in a chain with a combination padlock
cover_pos: center
cover_credit: https://www.pexels.com/photo/11391947/
---
[TechCrunch reports](https://techcrunch.com/2026/10/19/hackers-hit-ai-coding-tool-opencode-running-up-charges-on-users-ai-accounts/) that attackers broke into an older system at OpenCode, an open-source AI coding agent. The breach affected 1.4% of users of OpenCode Console, the online platform where some users kept API keys in workspaces.

The open-source app and command-line tool weren't affected. As co-founder Dax Raad put it, "those keys never come to us."

## What it cost people

Developers reported spending alerts and unauthorised charges on OpenAI, Anthropic and Google accounts. Some were charged hundreds of dollars, and a few reported totals above $1,000. Anthropic and Google blocked keys they believed were exposed, OpenAI worked on restoring access and refunding credits, and OpenCode said refunds were underway.

OpenCode called it "a large-scale distillation attack", though it hasn't explained how attackers got in, and some sceptics say that framing is unproven.

## The refusals problem

Here's the detail I keep thinking about. Raad said AI models the team used for analysis worked at first, then refused to continue once the malicious code triggered safety filters. OpenCode later got access to a vetted OpenAI program with models less likely to refuse defensive work, which Raad said helped.

It's one company's account, so I wouldn't generalise much. But it does show a real tension: filters that stop attackers can also get in the way of defenders in the middle of an incident.

## My read

An API key used to be a credential. With metered AI models, it's closer to a credit card. Set spending limits with your provider now, keep keys out of third-party dashboards where you can, and use separate keys per project so one leak doesn't cost you everything.
