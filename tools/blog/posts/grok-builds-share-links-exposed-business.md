---
title: Grok Build's share links exposed business data, including SpaceXSI's own
excerpt: Claroc says a design choice in Grok Build's sharing system let anyone list live projects and open them. Some of the exposed material belonged to SpaceXSI, the company that runs the platform.
date: 2026-11-12
published: 2026-11-12T06:15:34Z
tag: Security
cover: /public/resources/blog/grok-builds-share-links-exposed-business.jpg
cover_alt: A glowing red circuit board pattern surrounds a metallic chip with a red keyhole in its center
cover_pos: center
cover_credit: https://pixabay.com/photos/data-security-security-data-online-9145391/
---
Grok Build, the vibe-coding agent from SpaceXSI, has been leaking private data from thousands of its users. Some of it is proprietary business information, and some of it belongs to SpaceXSI itself. The findings come from new research by security firm Claroc, [as reported by Ars Technica](https://arstechnica.com/security/2026/11/grok-build-coding-agent-leaks-oodles-of-confidential-info-some-belonging-to-spacexsi/).

## How the sharing was supposed to work

Grok Build lets users share their apps through links. The platform randomizes those URLs, so only someone with the exact address should be able to reach the data.

According to Claroc, a design decision by the platform's developers undermines that protection. It makes it possible for anyone to enumerate thousands of live Grok Build projects. In most cases, clicking one of those links opens the app and reveals all the data tied to it.

## What was exposed

Claroc's research describes internal business plans, ad proposals, medical exam results, galley checklists from a celebrity cruise line, and employee names and ID numbers.

Some of the exposed material came from SpaceXSI's own apps. Claroc found 24 of them. The sampled documents included an onboarding plan marked confidential for a new member of the enterprise sales team, a sales territory map covering 594 accounts, internal system addresses for sales team tools, and advertising proposals.

"We were shocked," Claroc said in a Tuesday post. "The company that makes Grok had its own internal material open to anyone holding the link, and we had never been given it."

Claroc's argument is that a sales tool bought from a vendor would normally sit behind company sign-in. This one was built with AI and went live open to anyone with the link.

## What SpaceXSI did

Claroc says it notified SpaceXSI on Sunday. When there was no response, a Claroc official posted on X, tagging Elon Musk and Grok Manager Matt Palmer.

Ars Technica reports that the 24 SpaceXSI apps were still exposing information on Monday evening, while most of the other exposed data remained available. SpaceXSI began removing the links within a few hours of Ars emailing it questions for that article. By the time Ars published, links for all 24 apps returned an "app not found" error.

The reporting doesn't say what SpaceXSI plans to change in how sharing links work, or whether other affected users have been contacted.

## My read

A random link is only a protection if nobody can list the links. Here, the randomness didn't help, because the system's design let people find the projects in the first place. That's a basic failure in an access control, and it's easy to miss when the app looks like a simple sharing feature.

The irony is hard to miss. The company's own sales files were exposed through its own product. If you build with vibe-coding tools, check what "share" actually means before you put business data in an app. Ask two questions: can someone discover the link, not just guess it, and does the app require a sign-in? If the answer to either is unclear, keep the sensitive material somewhere else.
