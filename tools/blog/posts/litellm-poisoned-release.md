---
title: A poisoned LiteLLM release was live for under two hours. That was enough to worry about
excerpt: LiteLLM's release pipeline was compromised on 21 October, and version 1.107.0 shipped credential-stealing malware. Its incident report is worth reading if you run AI gateways.
date: 2026-11-04
event: 2026-10-21
tag: Security
cover: /public/resources/blog/litellm-poisoned-release.jpg
cover_alt: Aerial view of shipping containers stacked in rows at a port
cover_pos: center
cover_credit: https://www.pexels.com/photo/1427107/
---
LiteLLM sits between applications and AI providers, so it often holds the keys to all of them. That makes [its 21 October incident](https://docs.litellm.ai/blog/security-incident-oct-21-2026) especially uncomfortable.

## What happened

According to the project's report, attackers compromised the release pipeline and published `litellm==1.107.0` to PyPI and matching Docker images. The malicious PyPI package was live for roughly 1 hour 43 minutes, and Docker tags pointed to compromised images for about two and a half hours. The report says the release "contained compiled malware which steals credentials and loads remote-code execution tools."

The source tag on GitHub was clean, as were earlier versions.

## How they got in

The report describes a chain rather than one mistake. Release permissions had been temporarily widened that week. The attacker obtained GitHub CLI tokens, which the report says can appear in logs after being embedded in Claude Code responses, then used an organisation owner's token to disable branch protections and run the release workflow against a lookalike repository.

The first entry point is still only suspected. The post also warns that some of its statements were later found to be "inaccurate or incomplete", so check its canonical record for current details.

## If you installed it

- Pin to 1.106.2 or another explicit earlier version.
- Don't run `pip install` first, because Python startup re-runs the malicious files.
- Rebuild environments and images from scratch where you can.
- If it ran on a host with internet access, the report says to "assume the exfil succeeded" and rotate every secret that host could reach.

## My read

Two hours sounds short, but automated builds don't wait. Anything installing an unpinned `latest` during that window took the package without a human ever deciding to. Pinning versions is dull advice, and this is what it's for.
