---
title: PHP2Shell shows how bad "unauthenticated" and "everywhere" sound together
excerpt: Two critical PHP flaws were patched on 21 October, and Cloudflare says early attacks came before the patches. Millions of hosts may be exposed.
date: 2026-11-04
event: 2026-10-21
tag: Security
cover: /public/resources/blog/php2shell-critical-flaws.jpg
cover_alt: Lines of code on a dark computer screen, lit in blue
cover_pos: center
cover_credit: https://www.pexels.com/photo/546819/
---
PHP still runs a huge share of the web, which is why [PHP2Shell](https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/) got attention fast. BleepingComputer reported on 21 October that two critical remote code execution flaws, CVE-2026-109618 and CVE-2026-109619, can be exploited without logging in.

## Who's affected

The report says all PHP installations serving web requests are affected, including PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed. PHP's security team says it considers the risk highest for mod_php.

Researchers from Calif, OpenAI and Wiz found the flaws. VirusTotal estimates cited in the report put exposed PHP hosts at over 5.1 million, though an exposed host isn't necessarily an exploitable one.

## What to do

| Branch | Fixed version |
|---|---|
| PHP 8.5 | 8.5.12 |
| PHP 8.4 | 8.4.27 |
| PHP 8.3 | 8.3.36 |
| PHP 8.2 | 8.2.35 |

PHP 8.1 and older no longer get normal updates. Source backports exist for 7.4, 8.0 and 8.1, and some distributions may ship their own. PHP's temporary mitigations "don't fully protect against exploitation", so patching is the real fix.

Cloudflare's CTO said it was seeing early attacks before the patches were released, and the UK's NCSC told organisations to update immediately or take affected systems offline.

## My read

The hard part isn't the fix, it's finding every copy. PHP often lives in old containers, forgotten plugins and sites nobody officially owns. If you run anything older than 8.2, this is a good moment to find out who's responsible for it.
