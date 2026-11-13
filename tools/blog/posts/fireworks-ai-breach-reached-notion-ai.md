---
title: Fireworks AI breach reached Notion AI chat transcripts
excerpt: An attacker got into a Fireworks AI development system through its cloud provider. Notion says some of its customers' AI chat transcripts were among the data taken.
date: 2026-11-13
published: 2026-11-13T06:15:47Z
tag: Security
cover: /public/resources/blog/fireworks-ai-breach-reached-notion-ai.jpg
cover_alt: A dark screen shows a blue shield icon beside a white hand cursor
cover_pos: center
cover_credit: https://pixabay.com/photos/security-protection-antivirus-265130/
---
Fireworks AI, a platform developers use to access open AI models, has confirmed a cyberattack that exposed some of its customers' data. [TechCrunch reports](https://techcrunch.com/2026/11/12/cyberattack-on-fireworks-ai-allowed-hackers-to-access-notion-customers-chat-transcripts/) that Notion is one confirmed affected customer.

## What Fireworks says happened

In its latest security advisory, Fireworks says an attacker breached its cloud provider and used that access to reach a Fireworks development system. The company says the cybercriminals took customers' billing information and some datasets.

Fireworks says it has tens of thousands of customers worldwide, including Harvey and Cursor. The reporting does not say whether either of those companies was affected.

## Notion's side

Notion says Fireworks alerted it to a security incident and later confirmed that hackers had stolen some Notion customer data. Notion says the breach affected around 1% of its customers.

On November 3, Notion disconnected its systems from Fireworks, deleted the data stored in its systems, and stopped all connectivity between the two.

This week Notion confirmed that the hackers took chat transcripts from Notion AI customers who used the "Insights" feature. Notion says the transcripts include "any input to or output from the model that was written to the chat." It also says much of the data is unattributable, so it can't determine which customer each transcript came from.

## Fireworks' view of the attacker

Fireworks says it believes the hackers are financially motivated. In its account, their goal is to sell tokens obtained by breaching access to large language models. Those tokens go to unauthorized third parties, who can use up AI model usage without paying for their own.

This is the second breach affecting Fireworks in as many months, following a security incident in October.

## My read

The chain of dependencies is the important part here. Notion's chat transcripts were taken through a vendor's system, and that vendor's cloud provider was the entry point. Each hop adds a party whose security you depend on, and most users never see those hops.

If you use an AI feature built on a third-party model host, ask where your prompts and outputs are stored and who else can reach them. Notion's inability to tie much of the stolen data to specific customers makes that harder to answer after an incident.

Two incidents in two months is a pattern worth watching. Still, one company advisory and one customer's disclosure are not enough to judge Fireworks' security overall, and the details of how the attacker got in are limited to what Fireworks has published.
