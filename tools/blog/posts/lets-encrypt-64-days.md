---
title: Let's Encrypt moves to 64-day certificates in February. Check your cron jobs
excerpt: From 10 February 2027, certificates default to 64 days, on the way to 45. If renewal is hard-coded to a day count, it could break quietly.
date: 2026-11-04
event: 2026-10-07
tag: Security
cover: /public/resources/blog/lets-encrypt-64-days.jpg
cover_alt: A yellow padlock on a bright blue metal door
cover_pos: center
cover_credit: https://www.pexels.com/photo/20797620/
---
Let's Encrypt [confirmed its timeline](https://letsencrypt.org/2026/10/07/64-day-certs) on 7 October. It's a routine-sounding change that could still catch people out.

## The dates

| Date | What changes |
|---|---|
| 14 October 2026 | Staging issues 64-day certificates for testing |
| 10 February 2027 | Production defaults to 64-day lifetimes |
| 11 May 2027 | Last 90-day certificate expected to expire |
| 2028 | Default moves to 45 days |

Existing valid certificates won't be revoked, and rate limits, endpoints and chains aren't affected. The authorisation reuse window also drops from 30 days to 10, then to seven hours in 2028.

## What to check

If your ACME client supports ACME Renewal Info, the certificate authority tells it when to renew, so you should be covered.

The risk is hard-coded timing. Let's Encrypt suggests searching cron jobs, scripts and runbooks for numbers like 83, 80 or 60, and renewing at about two-thirds of the lifetime instead. A job that renews every 60 days will fall over once certificates last 64, as soon as one run is delayed. A job set to 83 days won't renew in time at all.

Also automate reloads and deployment, and add an alert for renewal failures.

## My read

Shorter certificates reward whoever already automated and punish whoever set this up once in 2019 and moved on. The dangerous bit is that nothing fails in February. It fails weeks later, when a certificate quietly expires. You can test against staging today.
