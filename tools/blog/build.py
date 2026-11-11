#!/usr/bin/env python3
"""Generate the blog in /blog from the Markdown-like files in tools/blog/posts/.

Navigation, footer and shared scripts come from the case-study generator, so they stay in sync.

Usage:
  python3 tools/blog/build.py          write the blog
  python3 tools/blog/build.py --check  exit 1 if anything would change (no writes)
"""
import html, importlib.util, json, math, os, re, sys
from datetime import date
from email.utils import format_datetime
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SITE = 'https://abdulhabeeb.com'
BASE = '/blog'
# While False, every blog page carries noindex and stays out of the sitemap.
LAUNCHED = False
# Bump when blog.css or blog.js change.
BLOG_VERSION = '20261104k'

spec = importlib.util.spec_from_file_location('case_build', os.path.join(ROOT, 'tools', 'case-studies', 'build.py'))
cs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cs)

UI_DE = {
    'bl_label': 'Blog', 'bl_title': 'Was gerade in KI und Daten passiert.',
    'bl_sub': 'Die Nachrichten, die deine Zeit wert sind, an der Quelle geprüft und mit allen Einschränkungen.',
    'bl_featured': 'Empfohlen', 'bl_recent': 'Neueste Beiträge', 'bl_rss': 'RSS-Feed', 'bl_all': '← Alle Beiträge',
    'bl_contents': 'Inhalt', 'bl_more': 'Weiterlesen', 'bl_lang': 'Dieser Beitrag ist auf Englisch verfasst.',
    'bl_bio': 'Data-Science- und Full-Stack-Entwickler in Saarbrücken. Ich schreibe darüber, was in KI und Daten passiert, mit Links zu den Quellen.',
    'bl_about': 'Mehr über mich', 'bl_alltopics': 'Alle', 'bl_sortby': 'Sortieren', 'bl_newest': 'Neueste', 'bl_oldest': 'Älteste', 'bl_none': 'Keine Beiträge gefunden.', 'bl_showmore': 'Mehr anzeigen', 'bl_photo': 'Foto', 'bl_min': 'Min. Lesezeit',
}


def inline(s):
    s = html.escape(s, quote=False)
    codes = []
    def keep(m):
        codes.append(f'<code>{m.group(1)}</code>')
        return f'\0{len(codes) - 1}\0'
    s = re.sub(r'`([^`]+)`', keep, s)
    def link(m):
        label, url = m.group(1), html.escape(m.group(2))
        extra = ' target="_blank" rel="noopener"' if url.startswith('http') else ''
        return f'<a href="{url}"{extra}>{label}</a>'
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?![\*\w])', r'<em>\1</em>', s)
    return re.sub('\0(\\d+)\0', lambda m: codes[int(m.group(1))], s)


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', re.sub(r"[’']", '', s.lower())).strip('-')


def chart(line, used):
    parts = [p.strip() for p in line[len('::chart'):].split('|')]
    cid, opts, title, text, source = parts
    if cid not in cs.CHART_DATA:
        raise SystemExit(f'unknown chart: {cid}')
    used[cid] = cs.CHART_DATA[cid]
    mode = f' data-mode="{opts[5:]}"' if opts.startswith('mode=') else ''
    return (f'<figure class="cs-chart is-wide" data-chart="{cid}"{mode}><div class="cs-chart-head"><h3>{inline(title)}</h3><p>{inline(text)}</p></div>'
            f'<div class="cs-chart-ctl"></div><div class="cs-chart-plot"></div><p class="cs-chart-src">{inline(source)}</p></figure>')


def table(block):
    rows = [[c.strip() for c in r.strip().strip('|').split('|')] for r in block]
    body_rows = rows[2:]
    # Right-align a column only if every cell in it is a number.
    numeric = [bool(body_rows) and all(re.fullmatch(r'\*{0,2}[\d.,]+%?\*{0,2}', r[i]) for r in body_rows) for i in range(len(rows[0]))]
    cls = lambda i: ' class="is-num"' if numeric[i] else ''
    head = ''.join(f'<th{cls(i)}>{inline(c)}</th>' for i, c in enumerate(rows[0]))
    body = ''.join('<tr>' + ''.join(f'<td{cls(i)}>{inline(c)}</td>' for i, c in enumerate(r)) + '</tr>' for r in body_rows)
    return f'<div class="bl-table"><table><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'


def render(md):
    out, toc, used = [], [], {}
    fence = re.compile(r'```(\w*)\n(.*?)\n```', re.S)
    pos = 0
    chunks = []
    for m in fence.finditer(md):
        chunks.append(('text', md[pos:m.start()]))
        chunks.append(('code', m.group(2)))
        pos = m.end()
    chunks.append(('text', md[pos:]))
    for kind, chunk in chunks:
        if kind == 'code':
            out.append(f'<pre><code>{html.escape(chunk, quote=False)}</code></pre>')
            continue
        for block in re.split(r'\n\s*\n', chunk.strip()):
            lines = block.strip().split('\n')
            first = lines[0]
            if not first:
                continue
            if first.startswith('## '):
                t = first[3:]; i = slugify(t); toc.append((i, t))
                out.append(f'<h2 id="{i}">{inline(t)}</h2>')
            elif first.startswith('::chart'):
                out.append(chart(first, used))
            elif first.startswith('|'):
                out.append(table(lines))
            elif first.startswith('- '):
                out.append('<ul>' + ''.join(f'<li>{inline(l[2:])}</li>' for l in lines) + '</ul>')
            elif re.match(r'\d+\. ', first):
                out.append('<ol>' + ''.join('<li>' + inline(re.sub(r'^\d+\. ', '', l)) + '</li>' for l in lines) + '</ol>')
            else:
                out.append(f'<p>{inline(" ".join(lines))}</p>')
    return '\n'.join(out), toc, used


def load_posts():
    posts = []
    for name in sorted(os.listdir(os.path.join(HERE, 'posts'))):
        if not name.endswith('.md'):
            continue
        raw = open(os.path.join(HERE, 'posts', name), encoding='utf-8').read()
        head, md = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S).groups()
        p = {k.strip(): v.strip() for k, v in (l.split(':', 1) for l in head.split('\n'))}
        p['title'] = p['title'].strip('"')
        p['slug'] = name[:-3]
        p['html'], p['toc'], p['charts'] = render(md)
        p['minutes'] = max(1, math.ceil(len(re.sub(r'```.*?```', '', md, flags=re.S).split()) / 200))
        # Readers see when the story happened; `date` stays the real publish date for feeds and structured data.
        p['date_label'] = date.fromisoformat(p.get('event', p['date'])).strftime('%-d %B %Y')
        p['url'] = f'{BASE}/{p["slug"]}/'
        p['cover_site'] = 'Pixabay' if 'pixabay.com' in p.get('cover_credit', '') else 'Pexels'
        posts.append(p)
    # Newest story first.
    posts.sort(key=lambda p: p.get('event', p['date']), reverse=True)
    return posts


def blog_nav():
    """The shared navbar, with the blog link marked as the current page."""
    return cs.nav().replace('<a class="nav-icon" href="/blog/">', '<a class="nav-icon is-active" href="/blog/" aria-current="page">')


def scripts(extra=''):
    the_nav, the_contact = cs.nav(), cs.contact()
    de = dict(cs.home_de(the_nav, the_contact)); de.update(UI_DE)
    de_json = json.dumps(de, ensure_ascii=False).replace('</', '<\\/')
    s = cs.SCRIPTS[:cs.SCRIPTS.index('const sideLinks')].replace('__PAGE_DE__', de_json) + '</script>\n'
    s += extra
    s += cs.SCRIPTS[cs.SCRIPTS.index('<script src="/public/vendor/lenis'):]
    s += f'<script src="/blog.js?v={BLOG_VERSION}" defer></script>\n'
    return s


def head(title, desc, url, image, ld, kind='website', charts=False):
    robots = '' if LAUNCHED else '  <meta name="robots" content="noindex" />\n'
    case_css = f'  <link rel="stylesheet" href="/case-study.css?v={cs.ASSET_VERSION}" />\n' if charts else ''
    e = html.escape
    if image.endswith('.svg'):
        image = '/public/resources/og-card.jpg'
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
{robots}  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}" />
  <link rel="canonical" href="{SITE}{url}" />
  <link rel="alternate" type="application/rss+xml" title="Abdul Habeeb's blog" href="{BASE}/feed.xml" />
  <meta property="og:type" content="{kind}" />
  <meta property="og:title" content="{e(title)}" />
  <meta property="og:description" content="{e(desc)}" />
  <meta property="og:url" content="{SITE}{url}" />
  <meta property="og:image" content="{SITE}{image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v={cs.ASSET_VERSION}" />
{case_css}  <link rel="stylesheet" href="/blog.css?v={BLOG_VERSION}" />
  <script>try{{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark-pre')}}catch(e){{}}</script>
</head>
'''


AUTHOR = {"@type": "Person", "@id": f"{SITE}/#person", "name": "Abdul Habeeb", "url": f"{SITE}/"}


def meta_line(p):
    return f'<span>{p["date_label"]}</span><i aria-hidden="true">·</i><span>{p["minutes"]} <span data-i18n="bl_min">min read</span></span>'


def card(p, hero=False):
    extra = ' data-hero="1"' if hero else ''
    return (f'<a class="bl-card bl-reveal" data-tag="{html.escape(p["tag"])}" data-date="{p.get("event", p["date"])}"{extra} href="{p["url"]}"><span class="bl-card-img"><img src="{p["cover"]}" alt="{html.escape(p["cover_alt"])}" style="object-position:{p["cover_pos"]}" loading="lazy" decoding="async" /><span class="label">{p["tag"]}</span></span>'
            f'<h3>{html.escape(p["title"])}</h3><p>{html.escape(p["excerpt"])}</p><span class="bl-meta">{meta_line(p)}</span></a>')


def slide(p, i):
    load = '' if i == 0 else ' loading="lazy"'
    current = ' is-active' if i == 0 else ''
    return (f'<a class="bl-slide{current}" href="{p["url"]}"><img src="{p["cover"]}" alt="{html.escape(p["cover_alt"])}" style="object-position:{p["cover_pos"]}"{load} />'
            f'<span class="bl-slide-copy"><span class="label">{p["tag"]}</span><strong class="bl-slide-title">{html.escape(p["title"])}</strong><span class="bl-slide-text">{html.escape(p["excerpt"])}</span></span>'
            f'<span class="bl-slide-by"><span class="bl-slide-author"><img src="/public/resources/heroimage.jpg" alt="" />Abdul Habeeb</span><span class="bl-meta">{meta_line(p)}</span></span></a>')


def index_page(posts):
    # The carousel always shows the three newest posts (posts arrive sorted newest first).
    slides = posts[:3]
    featured = slides[0]
    title = 'Blog — Abdul Habeeb'
    TAG_DE = {'Security': 'Sicherheit', 'Models': 'Modelle', 'Agents': 'Agenten', 'Data tools': 'Datentools', 'Research': 'Forschung', 'Regulation': 'Regulierung', 'Industry': 'Branche'}
    tags = sorted({p['tag'] for p in posts}, key=lambda t: (-sum(q['tag'] == t for q in posts), t))
    for t in tags:
        UI_DE['bl_tag_' + slugify(t)] = TAG_DE.get(t, t)
    tag_buttons = ''.join(f'<button type="button" aria-pressed="false" data-filter="{html.escape(t)}" data-i18n="bl_tag_{slugify(t)}">{html.escape(t)}</button>' for t in tags)
    desc = 'What\'s happening in AI and data, checked at the source, with the caveats left in.'
    ld = {"@context": "https://schema.org", "@type": "Blog", "name": "Abdul Habeeb's blog", "description": desc, "url": f"{SITE}{BASE}/", "inLanguage": "en", "author": AUTHOR,
          "blogPost": [{"@type": "BlogPosting", "headline": p['title'], "url": f"{SITE}{p['url']}", "datePublished": p['date']} for p in posts]}
    return head(title, desc, f'{BASE}/', featured['cover'], ld) + f'''<body>
<main class="page bl-page">
  {blog_nav()}
  <section class="bl-carousel" id="top" aria-roledescription="carousel" aria-label="Featured posts">
    <div class="bl-slides">{''.join(slide(p, i) for i, p in enumerate(slides))}</div>
    <div class="bl-dots" role="group" aria-label="Choose a featured post">{''.join(f'<button type="button" aria-label="Featured post {i + 1}"{" aria-current=true" if i == 0 else ""}></button>' for i in range(len(slides)))}</div>
    <div class="bl-search" role="search">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
      <input id="blSearch" type="search" placeholder="Search posts" aria-label="Search posts" autocomplete="off" />
      <div class="bl-results" id="blResults" hidden></div>
    </div>
  </section>

  <section class="bl-list" id="posts">
    <div class="bl-list-head"><div><h1 data-i18n="bl_title">What's happening in AI and data.</h1><p data-i18n="bl_sub">The news worth your time, checked at the source, with the caveats left in.</p></div><a href="{BASE}/feed.xml" data-i18n="bl_rss">RSS feed</a></div>
    <div class="bl-tools">
      <div class="bl-filters" role="group" aria-label="Filter by topic"><button type="button" class="is-on" aria-pressed="true" data-filter="" data-i18n="bl_alltopics">All</button>{tag_buttons}</div>
      <label class="bl-sort"><span data-i18n="bl_sortby">Sort by</span><select id="blSort"><option value="new" data-i18n="bl_newest">Newest</option><option value="old" data-i18n="bl_oldest">Oldest</option></select></label>
    </div>
    <p class="bl-empty" id="blEmpty" hidden data-i18n="bl_none">No posts match that search.</p>
    <div class="bl-grid" id="blGrid">{''.join(card(p, p in slides) for p in posts)}</div>
    <div class="bl-more-wrap"><button type="button" class="bl-more-btn" id="blMore" hidden data-i18n="bl_showmore">Show more</button></div>
  </section>

{cs.contact()}
</main>
{scripts()}</body>
</html>
'''


def post_page(p, posts):
    url = f'{SITE}{p["url"]}'
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BlogPosting", "headline": p['title'], "description": p['excerpt'], "url": url, "mainEntityOfPage": url,
         "image": SITE + ('/public/resources/og-card.jpg' if p['cover'].endswith('.svg') else p['cover']), "datePublished": p['date'], "dateModified": p['date'], "inLanguage": "en", "author": AUTHOR},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE}{BASE}/"},
            {"@type": "ListItem", "position": 3, "name": p['title'], "item": url}]}]}
    toc = ''.join(f'<a href="#{i}">{inline(t)}</a>' for i, t in p['toc'])
    others = [x for x in posts if x is not p]
    more = ([x for x in others if x['tag'] == p['tag']] + [x for x in others if x['tag'] != p['tag']])[:2]
    chart_js = ''
    if p['charts']:
        chart_js = ('<script type="application/json" id="cs-chart-data">' + json.dumps(p['charts'], ensure_ascii=False).replace('</', '<\\/') + '</script>\n'
                    f'<script src="/case-charts.js?v={cs.ASSET_VERSION}" defer></script>\n')
    return head(f'{p["title"]} — Abdul Habeeb', p['excerpt'], p['url'], p['cover'], ld, 'article', bool(p['charts'])) + f'''<body>
<div class="bl-progress" aria-hidden="true"><i></i></div>
<main class="page bl-page bl-post">
  {blog_nav()}
  <section class="bl-post-hero" id="top">
    <img class="bl-post-bg" src="{p['cover']}" alt="{html.escape(p['cover_alt'])}" style="object-position:{p['cover_pos']}" />
    <a class="bl-back" href="{BASE}/" data-i18n="bl_all">← All posts</a>
    <span class="label">{p['tag']}</span>
    <h1>{html.escape(p['title'])}</h1>
    <p>{html.escape(p['excerpt'])}</p>
    <span class="bl-meta"><img src="/public/resources/heroimage.jpg" alt="" /><span>Abdul Habeeb</span><i aria-hidden="true">·</i>{meta_line(p)}</span>
    <a class="bl-credit" href="{p['cover_credit']}" target="_blank" rel="noopener"><span data-i18n="bl_photo">Photo</span>: {p['cover_site']}</a>
  </section>

  <div class="bl-body">
    <nav class="bl-toc" aria-label="Contents"><span data-i18n="bl_contents">Contents</span>{toc}</nav>
    <article class="bl-article">
      <p class="bl-lang" data-i18n="bl_lang">This post is written in English.</p>
{p['html']}
      <aside class="bl-author"><img src="/public/resources/heroimage.jpg" alt="" /><div><strong>Abdul Habeeb</strong><p data-i18n="bl_bio">Data science and full-stack developer in Saarbrücken. I write about what's happening in AI and data, with links to the sources.</p><a href="/#profile" data-i18n="bl_about">More about me</a></div></aside>
    </article>
  </div>

  <section class="bl-list bl-more">
    <div class="bl-list-head"><h2 data-i18n="bl_more">Keep reading</h2><a href="{BASE}/" data-i18n="bl_all">← All posts</a></div>
    <div class="bl-grid is-two">{''.join(card(x) for x in more)}</div>
  </section>

{cs.contact()}
</main>
{scripts(chart_js)}</body>
</html>
'''


def feed(posts):
    e = html.escape
    items = ''.join(
        f'<item><title>{e(p["title"])}</title><link>{SITE}{p["url"]}</link><guid>{SITE}{p["url"]}</guid>'
        f'<pubDate>{format_datetime(datetime.fromisoformat(p["date"]).replace(tzinfo=timezone.utc))}</pubDate><description>{e(p["excerpt"])}</description></item>\n'
        for p in posts)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n'
            f'<title>Abdul Habeeb\'s blog</title><link>{SITE}{BASE}/</link><description>What is happening in AI and data, checked at the source.</description><language>en</language>\n'
            f'{items}</channel></rss>\n')


def main():
    check = '--check' in sys.argv
    posts = load_posts()
    files = {os.path.join('blog', 'index.html'): index_page(posts), os.path.join('blog', 'feed.xml'): feed(posts)}
    for p in posts:
        files[os.path.join('blog', p['slug'], 'index.html')] = post_page(p, posts)
    changed = []
    for rel, out in files.items():
        path = os.path.join(ROOT, rel)
        old = open(path, encoding='utf-8').read() if os.path.exists(path) else None
        if old != out:
            changed.append(rel)
            if not check:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(out)
    if check:
        print('up to date' if not changed else 'would change: ' + ', '.join(changed))
        sys.exit(1 if changed else 0)
    print(f'built {len(posts)} posts' + (f' ({len(changed)} files changed)' if changed else ' (no changes)'))


if __name__ == '__main__':
    main()
