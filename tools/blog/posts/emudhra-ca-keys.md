---
title: One certificate authority's private key was the number 4
excerpt: Eight eMudhra intermediate CA keys were so small that anyone could recover them in under a second. Browsers reacted quickly, but most other software trusts what's on disk.
date: 2026-11-04
event: 2026-10-20
tag: Security
cover: /public/resources/blog/emudhra-ca-keys.jpg
cover_alt: Two old padlocks fastened to a metal gate
cover_pos: center
cover_credit: https://www.pexels.com/photo/15373485/
---
This is one of the stranger security stories of the year. Scott Helme's [write-up](https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/) opens on a detail that sounds like a joke: "One of eMudhra's certificate authority private keys is the number 4."

## What went wrong

A P-384 private key should be a random 384-bit number. These eight keys were effectively a single byte. Since you can derive a public key from a private key, you just try values from 1 upward until one matches, at most about 255 steps. The author recovered all of them from public certificates in under a second on a laptop.

The key was effectively public from the day each certificate existed, an exposure of about 17 months. eMudhra's account on Mozilla's bug tracker says a ceremony script bug created a second, weak key pair on the hardware module, and similar names led someone to use the wrong keys.

## Why browsers are the easy part

Chrome and Firefox blocked the intermediates within hours of the 17 October report. Certificate Transparency also helps there: no TLS certificates chaining to these CAs appeared in the logs.

Non-browser software is the bigger concern. curl, Python, Node, Go, Java, git and package managers generally trust a CA bundle on disk and don't check revocation or transparency logs. In the author's tests, default curl, Python and Node on Linux and macOS accepted a forged certificate for api.stripe.com.

## What to do

Update anything that ships a CA bundle, including operating system certificates, `certifi`, Node and Homebrew, then rebuild container images once base images are updated. Devices that can't be updated will keep trusting these certificates until they expire in July 2039.

## My read

The internet's trust system has many careful layers, and this got through with a key you could guess. The positive part is how fast the browser ecosystem responded. The worrying part is how much software sits outside it.
