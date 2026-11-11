#!/usr/bin/env python3
"""Write one news post for the blog: pick a fresh AI/data story, have Claude write it, add a Pixabay cover.

Runs on a schedule in .github/workflows/autopost.yml; the workflow then runs build.py and commits.

Usage:
  python3 tools/blog/autopost.py            write one post into tools/blog/posts/
  python3 tools/blog/autopost.py --count 2  write up to two posts

Needs ANTHROPIC_API_KEY and PIXABAY_KEY in the environment.
"""
import argparse, base64, calendar, io, json, os, re, sys, time
from datetime import datetime
from typing import List
from zoneinfo import ZoneInfo

import anthropic, feedparser, requests, trafilatura
from PIL import Image
from pydantic import BaseModel

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
POSTS = os.path.join(HERE, 'posts')
COVERS = os.path.join(ROOT, 'public', 'resources', 'blog')
STATE = os.path.join(HERE, 'autopost-state.json')

MODEL = 'claude-haiku-5-5'
TAGS = ['Models', 'Research', 'Security', 'Industry', 'Agents', 'Data tools', 'Regulation']
MAX_AGE_HOURS = 36
MIN_WORDS = 250
COVER_WIDTH = 1300
UA = 'abdulhabeeb.com blog bot (+https://abdulhabeeb.com/blog/)'
FEEDS = {
    'TechCrunch': 'https://techcrunch.com/category/artificial-intelligence/feed/',
    'The Verge': 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    'MIT Technology Review': 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    'Ars Technica': 'https://arstechnica.com/ai/feed/',
    'Hugging Face': 'https://huggingface.co/blog/feed.xml',
    'Google': 'https://blog.google/technology/ai/rss/',
    'OpenAI': 'https://openai.com/news/rss.xml',
}

client = anthropic.Anthropic()


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def load_state():
    try:
        return json.load(open(STATE, encoding='utf-8'))
    except FileNotFoundError:
        return {'stories': [], 'photos': []}


def save_state(state):
    # Keep the file small: the last 500 of each is plenty to avoid repeats.
    state = {k: v[-500:] for k, v in state.items()}
    with open(STATE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=1)
        f.write('\n')


def read_posts():
    posts = []
    for name in sorted(os.listdir(POSTS)):
        if name.endswith('.md'):
            head = open(os.path.join(POSTS, name), encoding='utf-8').read().split('---', 2)[1]
            meta = dict(l.split(':', 1) for l in head.strip().split('\n') if ':' in l)
            posts.append({'slug': name[:-3], **{k.strip(): v.strip() for k, v in meta.items()}})
    return sorted(posts, key=lambda p: p.get('date', ''), reverse=True)


def candidates(seen):
    now, out = time.time(), []
    for source, url in FEEDS.items():
        feed = feedparser.parse(url, agent=UA)
        for e in feed.entries:
            t = e.get('published_parsed') or e.get('updated_parsed')
            link = e.get('link', '')
            if not t or not link or link in seen:
                continue
            if (now - calendar.timegm(t)) / 3600 <= MAX_AGE_HOURS:
                out.append({'source': source, 'title': e.title.strip(), 'link': link})
        log(f'feed {source}: {len(feed.entries)} entries')
    return out


class Pick(BaseModel):
    ranked: List[int]


def rank(cands, recent_titles):
    """Ask the model which headlines are worth a post, best first."""
    lines = '\n'.join(f'{i}. [{c["source"]}] {c["title"]}' for i, c in enumerate(cands))
    covered = '\n'.join(f'- {t}' for t in recent_titles)
    r = client.messages.parse(
        model=MODEL, max_tokens=4000, output_format=Pick,
        messages=[{'role': 'user', 'content': f"""You choose stories for a blog about AI and data written by a data scientist. Readers want real advances and news with substance: new models, research results, tools for data and ML work, security issues, regulation, and significant industry moves.

Skip: gossip and scandals, executive personal lives, stock and IPO chatter, pure funding or acquisition announcements with no technical substance, consumer gadget launches, opinion columns, customer case studies and marketing posts, and anything already covered by the recent posts listed below (same story, even with a different headline).

Return the numbers of up to 6 headlines worth a post, best first. Return an empty list if none qualify.

Recent posts already on the blog:
{covered}

Headlines:
{lines}"""}])
    if r.stop_reason == 'refusal' or r.parsed_output is None:
        return []
    return [i for i in r.parsed_output.ranked if 0 <= i < len(cands)]


def article_text(url):
    downloaded = trafilatura.fetch_url(url)
    return (trafilatura.extract(downloaded or '', include_links=False, include_comments=False) or '').strip()


def style_examples():
    return '\n\n'.join(f'=== EXAMPLE {i} ===\n' + open(os.path.join(POSTS, n), encoding='utf-8').read()
                       for i, n in enumerate(['aleph-alpha-kolibri.md', 'agent-benchmark-oracle-failure.md'], 1))


SYSTEM = """You write news posts for Abdul Habeeb's blog about AI and data. The blog's promise: the news worth your time, checked at the source, with every caveat.

Rules:
- Use ONLY facts stated in the source article provided. Never add numbers, dates, names, quotes or claims that are not in it. If the source is thin, write a shorter post rather than padding.
- Quote only words that appear in quotation marks in the source, and attribute them to the person the source attributes them to. Paraphrase everything else.
- Attribute claims: say who claims what ("Google says", "according to The Verge"). Treat company claims as claims.
- Link the source article at least once, inline, with Markdown.
- Write as the blog's author reporting the news. Never mention "the source", "the article text" or what you were given. If a detail is missing, say it hasn't been published or wasn't disclosed. Never promise follow-ups or future posts.
- Plain, direct English. Short paragraphs. Use `##` subheadings. No hype words, no filler openers, no conclusions like "only time will tell". End with a short "## My read" section that gives a grounded take.
- 300-550 words of body.
- Output ONLY the post file, starting with the front matter, in exactly this shape:
---
title: <specific, plain headline, may take a stance>
excerpt: <one or two sentences>
event: <YYYY-MM-DD of the news event only if the source states the date, else omit this line>
tag: <one of: Models, Research, Security, Industry, Agents, Data tools, Regulation>
image_query: <2-4 word stock photo search for a fitting, non-literal photo; no brand or product names>
---
<body>

Two example posts from the blog, to match tone and structure (their date and cover lines are added by a different step):

"""


def write_post(story, text):
    r = client.messages.create(
        model=MODEL, max_tokens=16000, system=SYSTEM + style_examples(),
        messages=[{'role': 'user', 'content': f"Source: {story['source']}\nURL: {story['link']}\nHeadline: {story['title']}\n\nArticle text:\n{text}\n\nWrite the post."}])
    if r.stop_reason != 'end_turn':
        raise ValueError(f'stopped: {r.stop_reason}')
    return ''.join(b.text for b in r.content if b.type == 'text').strip()


def parse_post(raw, story):
    m = re.match(r'---\n(.*?)\n---\n(.*)', raw.strip() + '\n', re.S)
    if not m:
        raise ValueError('no front matter')
    head, body = m.groups()
    meta = {}
    for line in head.strip().split('\n'):
        k, _, v = line.partition(':')
        meta[k.strip()] = v.strip()
    for k in ('title', 'excerpt', 'tag', 'image_query'):
        if not meta.get(k):
            raise ValueError(f'missing {k}')
    if meta['tag'] not in TAGS:
        raise ValueError(f'bad tag {meta["tag"]}')
    if meta.get('event') and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', meta['event']):
        meta.pop('event')
    if story['link'] not in body:
        raise ValueError('source link missing')
    words = len(body.split())
    if not 200 <= words <= 900:
        raise ValueError(f'{words} words')
    if re.search(r'\b(the source|article text|text I had|I was given)\b', body, re.I):
        raise ValueError('mentions its input')
    return meta, body.strip()


def slug_for(title, taken):
    words = re.sub(r'[^a-z0-9 ]+', '', re.sub(r"[’']", '', title.lower())).split()
    stop = {'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'its', 'it', 'but', 'by', 'as', 'at', 'from', 'that', 'this', 'now', 'yet'}
    base = '-'.join([w for w in words if w not in stop][:6]) or 'post'
    slug, n = base, 2
    while slug in taken:
        slug, n = f'{base}-{n}', n + 1
    return slug


def find_photo(query, tag, used):
    for q in (query, ' '.join(query.split()[:2]), f'{tag} technology'):
        r = requests.get('https://pixabay.com/api/', timeout=30, params={
            'key': os.environ['PIXABAY_KEY'], 'q': q, 'image_type': 'photo', 'orientation': 'horizontal',
            'safesearch': 'true', 'min_width': COVER_WIDTH, 'per_page': 20, 'order': 'popular'})
        r.raise_for_status()
        for hit in r.json().get('hits', []):
            if hit['id'] not in used:
                return hit
    raise ValueError(f'no photo for {query!r}')


def save_cover(hit, slug):
    img = Image.open(io.BytesIO(requests.get(hit['largeImageURL'], timeout=60).content)).convert('RGB')
    if img.width > COVER_WIDTH:
        img = img.resize((COVER_WIDTH, round(img.height * COVER_WIDTH / img.width)), Image.LANCZOS)
    os.makedirs(COVERS, exist_ok=True)
    img.save(os.path.join(COVERS, f'{slug}.jpg'), 'JPEG', quality=82, optimize=True, progressive=True)
    small = img.copy()
    small.thumbnail((800, 800))
    buf = io.BytesIO()
    small.save(buf, 'JPEG', quality=80)
    return base64.b64encode(buf.getvalue()).decode()


def alt_text(b64):
    r = client.messages.create(
        model=MODEL, max_tokens=2000,
        messages=[{'role': 'user', 'content': [
            {'type': 'image', 'source': {'type': 'base64', 'media_type': 'image/jpeg', 'data': b64}},
            {'type': 'text', 'text': 'Write alt text for this photo: one plain sentence under 15 words describing what is visible. No brand names or readable text, no "image of" or "photo of". Output only the sentence.'}]}])
    alt = ''.join(b.text for b in r.content if b.type == 'text').strip().strip('"').rstrip('.')
    return re.sub(r'\s+', ' ', alt) or 'Abstract technology photo'


def one_line(s):
    return re.sub(r'\s+', ' ', s).strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--count', type=int, default=1)
    args = ap.parse_args()

    state = load_state()
    posts = read_posts()
    cands = candidates(set(state['stories']))
    log(f'{len(cands)} new headlines')
    if not cands:
        return
    order = rank(cands, [p.get('title', '') for p in posts[:40]])
    log('ranked:', [cands[i]['title'][:60] for i in order])

    written, taken = 0, {p['slug'] for p in posts}
    today = datetime.now(ZoneInfo('Europe/Berlin')).date().isoformat()
    for i in order:
        if written >= args.count:
            break
        story = cands[i]
        try:
            text = article_text(story['link'])
            if len(text.split()) < MIN_WORDS:
                log(f'skip (too short): {story["title"]}')
                state['stories'].append(story['link'])
                continue
            meta, body = None, None
            for attempt in (1, 2):
                try:
                    meta, body = parse_post(write_post(story, text), story)
                    break
                except ValueError as e:
                    log(f'attempt {attempt} rejected: {e}')
            if not meta:
                state['stories'].append(story['link'])
                continue
            slug = slug_for(meta['title'], taken)
            hit = find_photo(meta['image_query'], meta['tag'], set(state['photos']))
            alt = alt_text(save_cover(hit, slug))
            lines = ['---', f'title: {one_line(meta["title"])}', f'excerpt: {one_line(meta["excerpt"])}', f'date: {today}']
            if meta.get('event'):
                lines.append(f'event: {meta["event"]}')
            lines += [f'tag: {meta["tag"]}', f'cover: /public/resources/blog/{slug}.jpg', f'cover_alt: {one_line(alt)}',
                      'cover_pos: center', f'cover_credit: {hit["pageURL"]}', '---']
            with open(os.path.join(POSTS, f'{slug}.md'), 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines) + '\n' + body + '\n')
            state['stories'].append(story['link'])
            state['photos'].append(hit['id'])
            taken.add(slug)
            written += 1
            print(f'wrote {slug}: {meta["title"]}')
        except Exception as e:  # one bad story should not stop the run
            log(f'skip ({type(e).__name__}: {e}): {story["title"]}')
    save_state(state)
    log(f'done: {written} post(s)')


if __name__ == '__main__':
    main()
