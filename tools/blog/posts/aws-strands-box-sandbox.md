---
title: AWS's Strands Box treats an AI agent like untrusted code
excerpt: The open-source sandbox combines OS isolation with policies that can consider what an agent already did. It's an early preview, and macOS only for now.
date: 2026-11-04
event: 2026-10-07
tag: Agents
cover: /public/resources/blog/aws-strands-box-sandbox.jpg
cover_alt: A computer showing code on a desk beside a laptop, in a warmly lit room
cover_pos: center
cover_credit: https://www.pexels.com/photo/4218883/
---
Agents get more useful as they get more access, which is also when they get more dangerous. [AWS's Strands Box](https://aws.amazon.com/blogs/opensource/introducing-strands-box-ai-agent-sandboxes-powered-by-dogwood/), released in developer preview on 7 October under Apache 2.0, is one attempt at that trade-off.

## Two layers

- **Containment:** OS-level isolation, such as macOS Seatbelt, sets what the agent can reach on the host and network. This is the hard boundary.
- **Policy:** inside that boundary, the Dogwood policy engine checks individual actions at enforcement points: network requests, a Shell and a Python interpreter, and a broker for MCP servers.

Policies can account for earlier actions, so you can write a rule that caps how often an agent posts to Slack. The gateway can also attach credentials to permitted requests, so the agent never sees the real secrets.

## Limits

It only supports macOS right now. The Shell and Python interpreters run outside the sandbox, which widens what you have to trust. Policy only covers operations that pass through the enforcement points, so anything granted directly in the config is bounded by containment alone.

## My read

Policies with memory are the part I find interesting. Most sandboxes ask "may this action happen?", while the risky behaviour is often a sequence: read a secret, then make a network request. Each step can look fine by itself.

Keeping credentials away from the agent is also the right instinct, and it fits [the rules I'd want after the Qwen report](/blog/open-weight-model-beijing-upload/). It's a preview though, so try it, and don't treat it as your only safety layer.
