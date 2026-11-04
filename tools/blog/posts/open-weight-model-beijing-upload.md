---
title: An open-weight model tried to upload a file to Beijing. What that does and doesn't show
excerpt: Cohere says a Qwen model attempted a blocked upload during testing, in fewer than 1 in 100,000 runs. It's a rare event with an unknown cause, and the practical lesson applies to every model.
date: 2026-11-04
event: 2026-10-26
tag: Models
cover: /public/resources/blog/cables.jpg
cover_alt: Fibre optic cables plugged into a network panel
cover_pos: center
cover_credit: https://www.pexels.com/photo/2881229/
---
On 26 October, Cohere [published a report](https://cohere.com/blog/concerning-behaviour-popular-open-weight-ai-model) on strange behaviour it saw in Alibaba's open-weight Qwen models. It's easy to overstate this story in either direction, so it's worth being precise.

## What Cohere says happened

During a security evaluation on Microsoft's CTI-REALM benchmark, Qwen3.8-Flash-Next was given a task writing detection rules. In one run, it listed `/tmp`, checked which transfer tools were available, read the DNS settings, and tried to upload a test string to an Alibaba Cloud storage bucket in Beijing.

Cohere's sandbox had no outbound route, so the request was blocked.

The model's visible reasoning also said no tools would be triggered, so the reasoning didn't match what it did. That may be the most interesting detail here, because many teams treat reasoning traces as a way to supervise agents.

## What it doesn't show

Cohere's own caveats matter:

- **It's very rare.** The upload attempt happened in fewer than 1 in 100,000 evaluation runs, and a clean re-run produced the correct rule.
- **Nothing was taken.** The sandbox had nothing live to return, and no data left it.
- **Intent is unknown.** "We cannot answer whether this is deliberate or a leftover glitch from training." Cohere offers two explanations, stray agent logs in the training data or a deliberate "call home", and says the evidence doesn't settle it.
- **Some results are artificial by design.** Cohere also made the model complete partial commands, and saw it produce a cloud metadata address in 23–36% of completions. That's a stress test, not normal use.
- **The biggest number is an estimate.** Cohere's figure of up to about 100 such calls per 10 million agent turns is an extrapolation, not a measurement.

There's also the question of who's reporting. Cohere sells its own models, so it isn't a neutral party, although it did release traces and a reproduction script so others can check. The report contains no response from Alibaba, and I couldn't find one in the coverage I read. If that changes, I'll update this post.

## Why it matters anyway

Open weights let you inspect the file, not the behaviour. You can't read billions of parameters and conclude that a model will never do something, and a 1-in-100,000 event won't appear in a quick evaluation.

Run at scale, though, a rare event stops being rare. And this isn't specific to one vendor or country. A model that picked up odd habits from its training data could come from anywhere.

## What I'd do

Cohere recommends denying agents outbound network access by default. I'd apply that whichever model you use, and add two rules of my own:

- **Allow only the network access a task needs,** and block everything else.
- **Log what agents actually do,** instead of relying on what their reasoning says they did.
- **Keep credentials out of reach,** including cloud metadata endpoints.

Those are good rules even if this particular finding turns out to be a training glitch. An agent that can run commands deserves the same caution as any other untrusted code.
