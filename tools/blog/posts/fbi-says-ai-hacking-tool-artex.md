---
title: The FBI says AI hacking tool Artex can go from target to compromise in under three hours
excerpt: The FBI warns that hackers are using Artex, an open source AI penetration testing platform, in attacks on finance, government and tech. Its developer has since closed the source, but the earlier version is still circulating.
date: 2026-11-17
published: 2026-11-17T06:15:25Z
tag: Security
cover: /public/resources/blog/fbi-says-ai-hacking-tool-artex.jpg
cover_alt: A close-up of a blue human eye overlaid with glowing digital circuit patterns and binary code
cover_pos: center
cover_credit: https://pixabay.com/photos/eye-information-technology-digital-3374462/
---
The FBI has issued a flash cybersecurity advisory warning that hackers are using autonomous AI hacking tools in attacks across the U.S. and globally. One of the tools it names is Artex. [TechCrunch's report](https://techcrunch.com/2026/11/16/fbi-says-artex-ai-open-source-hacking-tool-used-to-breach-networks-in-under-three-hours/) covers the advisory and the incidents linked to it.

## What Artex is

Artex is one of several open source AI-powered penetration testing platforms, which are built to probe a network's defenses. According to the FBI, hackers can connect it to hosted frontier models from Anthropic and OpenAI, as well as to open source and non-U.S. models.

The FBI says Artex intrusions can be "noisy," generating a lot of traffic that may set off a target's alerts. The speed is the bigger problem. In some cases, Artex-linked attacks go from targeting a system to active compromise "in under three hours."

## How the attacks work

According to the advisory, Artex often starts by scanning a victim's network for weaknesses, then exploits simple flaws such as weak protections and exposed or stolen passwords. From there, it helps the attacker spread across the network to reach databases, mailboxes and other sensitive data.

The FBI says the targets include financial services, government, tech, defense, phone and internet companies, and law firms.

## Incidents

In South Korea, several financial institutions were hit. The attacks are blamed largely on weak defenses, including a lack of multi-factor authentication. Hackers stole the personal data of at least 68,000 people.

The FBI confirmed earlier findings from Microsoft that hackers used Artex to break into IT management company ConnectWise and reach the Microsoft 365 cloud environments of at least 2,250 of its customers. Microsoft says the hackers are likely Chinese. ConnectWise did not respond to TechCrunch's request for comment on the FBI's claim.

Barracuda said it was also breached in an Artex-linked attack by financially motivated criminals. The tool found an exposed credential for a third-party service that Barracuda had not revoked after it ended work with that vendor. The hackers then reached credential stores that Barracuda used to collect data from customer systems. Barracuda said its logs were not detailed enough to rule out access, so it chose to "assume the worst" and changed all of its customer credentials. A spokesperson told TechCrunch the company directly notified "a minority of XDR customers" to revoke and recreate integration credentials, but did not say how many.

Barracuda's chief information security officer, Arve Kjoelen, wrote: "Defenders who rely on spotting malicious activity and then responding to it will often arrive after the attacker has finished."

## The tool itself is exposed

After the attacks, the developer made Artex closed source. The FBI says the earlier open source version is still circulating and remains "widely accessible."

Researchers also found hundreds of Artex systems exposed on the internet with no password, likely through mistakes or misconfiguration. One of them was the system used against South Korea's financial sector.

## My read

The most useful line in this story is Kjoelen's. If an attacker can get from first scan to compromise in a few hours, detection-and-response plans built around humans noticing alerts are already behind. The basics in the FBI's account are old ones: multi-factor authentication, revoking credentials when a vendor relationship ends, and not leaving admin systems open without a password. Those are the controls that stop this kind of tool from working. Check them first, especially for any third-party access you forgot about.
