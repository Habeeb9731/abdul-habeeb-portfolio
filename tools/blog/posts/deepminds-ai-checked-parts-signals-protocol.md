---
title: DeepMind's AI checked parts of Signal's protocol with math and found no new flaws
excerpt: Google DeepMind used agentic AI to formally verify several cryptographic guarantees in the Signal protocol. It was a four-week proof of concept, and it covered only part of the system.
date: 2026-11-11
published: 2026-11-11T14:33:22Z
tag: Research
cover: /public/resources/blog/deepminds-ai-checked-parts-signals-protocol.jpg
cover_alt: Illuminated triangular frames display colorful curved grid patterns of light against a dusk-blue sky
cover_pos: center
cover_credit: https://pixabay.com/photos/lights-colors-installation-toronto-3929771/
---
Google DeepMind researchers used agentic AI to mathematically prove key cryptographic guarantees in the Signal protocol. [Ars Technica reports](https://arstechnica.com/ai/2026/11/signals-encryption-just-passed-an-ai-powered-mathematical-checkup/) that the work was a proof-of-concept project, completed in four weeks, and that it was also a test of a new DeepMind framework called AlphaProof Code.

## What was checked

The work is a formal verification effort. Formal verification uses math to check that software does what it is meant to do. Its supporters have long called it a holy grail of software security, because it can show that software doesn't have critical vulnerabilities.

Ars Technica describes the Signal protocol as the cryptography behind communications on platforms including the Signal app, Google Messages and WhatsApp. On that basis, the report calls the DeepMind result further independent validation of that cryptography. The published details don't list each guarantee that was verified, so I can't say which ones were covered.

## What it didn't find

According to the report, the analysis found no new vulnerabilities in the parts of the protocol it examined.

The researchers also ran AlphaProof Code on older versions of Signal that contain known vulnerabilities, which had been fixed long ago. The tool correctly identified those flaws and showed that the protocol in those versions could not be formally verified. That result matters because it shows the method can fail when it should.

## Why AI matters here

Before AI, the report says, it was very slow for people to describe the properties they wanted to prove, turn those descriptions into formulas, and build the proofs. Agentic AI can cut down the time for that last step, which is what made a four-week project possible.

The scope is still narrow. The analysis did not formally verify the entire Signal mobile app. Swarat Chaudhuri, a DeepMind research scientist, told WIRED: "We are very excited by this result, but there is a long distance to go before we are able to scale this to all the software of the world, and we want to do that." Ars Technica also notes that it is unclear how practical AI-aided formal verification will be for widespread use, or how well it will work on large amounts of code.

The researchers are releasing the specification and proof they developed for the Signal analysis. That lets other teams check the work and reuse it.

## My read

This is a useful signal, not a security guarantee for Signal as a whole. The result that matters most to me is the negative control. A verifier that flags old, known bugs and refuses to verify those versions is more believable than one that only says "passed." Still, the scope is limited to parts of the protocol, and the publicly described work doesn't show how the approach performs on a large codebase. If you rely on end-to-end encrypted messaging, the practical step is still to keep your apps updated, and this result doesn't change that.
