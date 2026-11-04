---
title: Cloudflare wants to become a certificate authority, and quantum readiness is part of why
excerpt: Cloudflare plans to issue public certificates, buy an established root from GlobalSign, and offer Merkle Tree Certificates in early 2027. None of it is live yet.
date: 2026-11-04
event: 2026-09-29
tag: Security
cover: /public/resources/blog/cloudflare-certificate-authority.jpg
cover_alt: A clean, empty corridor between rows of server racks
cover_pos: center
cover_credit: https://www.pexels.com/photo/325229/
---
Cloudflare has long been one of the biggest buyers of public certificates. In a [29 September post](https://blog.cloudflare.com/cloudflare-certificate-authority/), it said it plans to start issuing them itself.

## The plan

- Apply to the Chrome, Apple, Microsoft and Mozilla root programs.
- Acquire an established root from GlobalSign, trusted since 2012, to reach older devices.
- Issue through ACME first, so existing users could switch by changing a directory URL.
- Require subscribers to support ACME Renewal Information and keep renewal automated.
- Publish reproducible builds of the signing software, and run a public dashboard for issuance health and incidents.
- Issue Merkle Tree Certificates, designed for a post-quantum world, targeting early 2027.

## Why do this?

Cloudflare gives practical reasons: rate limits, validation problems, revocation delays and slow root distribution when relying on outside authorities. It also describes Let's Encrypt's large share of free certificates as a systemic risk if it had a serious outage.

Volumes matter too. Cloudflare expects certificate numbers to grow as lifetimes shrink and automated agents multiply.

## What to keep in mind

This is all stated intent. Cloudflare says it "will be a little while" before it issues anything, root program acceptance isn't guaranteed, and classic certificates will stay in use for many more years.

## My read

More authorities should reduce the risk of depending on one. But Cloudflare already sits in front of a large share of the web, and adding certificates concentrates another layer in the same company. The public dashboard and reproducible builds are good commitments. I'd judge this by whether they're still maintained in two years.
