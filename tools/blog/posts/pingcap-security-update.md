---
title: PingCAP's breach report is useful because it says what it doesn't know yet
excerpt: Attackers used stolen service account credentials to reach PingCAP's internal systems for about four weeks. The company published what was taken and what's still open.
date: 2026-11-04
event: 2026-10-19
tag: Security
cover: /public/resources/blog/pingcap-security-update.jpg
cover_alt: A hand typing on a laptop in a dark room, with green text on the screen
cover_pos: center
cover_credit: https://www.pexels.com/photo/5935787/
---
PingCAP, the company behind the TiDB database, [published a security update](https://www.pingcap.com/trust-hub/security/security-update-october-2026/) on 19 October covering unauthorised access between 9 September and 7 October.

## What's known

The attacker used stolen service account credentials to reach internal systems, copied data and obtained source code. Exported records included names and email addresses, organisation and project details, SQL editor text and errors, customer contracts and pricing, billing configuration, and a table of encrypted TiDB Cloud API-key values.

PingCAP says "there is no evidence that data stored in TiDB was impacted", and investigators found no evidence of commands run or persistent access in the production systems they reviewed.

An outside firm also reported four vulnerabilities, all fixed by 14 October.

## What's still open

As of the report, several things weren't settled: customer-specific impact, whether those vulnerabilities were exploited earlier, whether other usable credentials were exposed, and broader improvements like credential rotation and export alerts. Customers are to be told directly once impact is established.

## My read

SQL editor text is the item that stands out to me. Queries can contain customer names, table structures and sometimes pasted secrets, so it's easy to underestimate how sensitive that history is.

Four weeks is also a long time, and service accounts are hard to watch because they don't log in like people. If yours can export data, an alert on unusual exports is cheap compared with finding out a month later.
