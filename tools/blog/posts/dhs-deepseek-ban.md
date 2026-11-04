---
title: The US DeepSeek ban raises a question nobody has answered: what counts as "using" it?
excerpt: DHS ordered federal civilian agencies to remove DeepSeek products and third-party services built with them. Critics say the wording is the real problem.
date: 2026-11-04
event: 2026-10-19
tag: Regulation
cover: /public/resources/blog/dhs-deepseek-ban.jpg
cover_alt: A person holding a closed laptop in a dark room
cover_pos: center
cover_credit: https://www.pexels.com/photo/5926400/
---
[The Register reports](https://www.theregister.com/security/2026/10/20/deepseek-deep-sixed-at-all-us-federal-civilian-agencies/5304010) that the US Department of Homeland Security ordered federal civilian agencies to stop using DeepSeek technology and remove existing implementations.

The scope covers "all DeepSeek and DeepSeek-affiliate products, and third-party products and services developed using DeepSeek implementations." The order cites risks from data flowing to servers in China, data collection, the app, and possible malware or vulnerabilities in the model. The report mentions no exceptions or deadlines.

## The ambiguity

Banning an app and an API is simple enough. The third-party clause is harder. It's unclear whether "developed using" means ongoing API access or anything built with DeepSeek's help at some point.

Gateways make that messier. Services like OpenRouter can route requests to DeepSeek models without an agency intending it. Security expert Katie Moussouris told The Register that banning the app and API is "workable", but that "The order doesn't say what 'developed using' means." She also argued that applying it to US-hosted copies of open models goes too far, since hosting them in the US avoids most of the data-flow risk.

The article also notes that agencies barred from these open-weight models could face higher prices from favoured US model makers.

## My read

There are two different concerns here, and they need different answers: where your data goes, and what a model might do. Self-hosting addresses the first one. It doesn't address the second, which is something [recent research on backdoored models](/blog/abliterated-model-backdoors/) makes clear. A rule that treats them as one problem will be hard to follow and easy to get wrong.
