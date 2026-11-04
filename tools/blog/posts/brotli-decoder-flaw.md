---
title: A flaw in Brotli reached .NET, and your system update may not fix it
excerpt: Microsoft shipped emergency .NET patches for a critical bug in the Brotli decoder. Apps that bundle their own copy need their own fix.
date: 2026-11-04
event: 2026-10-25
tag: Security
cover: /public/resources/blog/brotli-decoder-flaw.jpg
cover_alt: Colourful source code on a dark monitor
cover_pos: center
cover_credit: https://www.pexels.com/photo/270348/
---
Compression libraries are easy to forget about, because they're usually a dependency of a dependency. CVE-2026-111497 is a reminder that they parse untrusted data all day.

[BleepingComputer reports](https://www.bleepingcomputer.com/news/microsoft/microsoft-releases-emergency-net-patches-for-critical-brotli-flaw/) that the critical flaw is an out-of-bounds write in the Brotli decoder. A crafted compressed stream can cause crashes or memory leaks, and in some cases remote code execution.

## Who needs to act

Microsoft released out-of-band updates for .NET:

| Version | Fixed in |
|---|---|
| .NET 8 | 8.0.33 |
| .NET 9 | 9.0.22 |
| .NET 10 | 10.0.14 |
| .NET 11 | Release Candidate 3 |

The .NET risk is narrower than the headline suggests. Brotli decompression isn't on by default, so apps must have opted in through ASP.NET Core request decompression, HttpClient automatic decompression, or the Brotli APIs.

At the time of the report, proof-of-concept exploits were public on GitHub, with no confirmed malicious use.

## The catch

"Updating the system Brotli library does not address apps that bundle their own copy." I think that's the most useful line in the story. Plenty of software ships its own compression code, and it won't show up when you update the operating system.

If you can't patch yet, the report suggests blocking Brotli-compressed requests at a proxy or firewall, or disabling Brotli decoding.
