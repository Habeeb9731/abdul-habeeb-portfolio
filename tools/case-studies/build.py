#!/usr/bin/env python3
"""Generate the case-study pages in /projects/<slug>/index.html.

Content lives in tools/case-studies/data/:
  projects.json    one entry per project, in carousel order (English copy + German in "de")
  ui-de.json       German for the shared interface labels (section headings, side nav, buttons)
  icons.json       feature-card icons (SVG paths by name)
  chart-data.json  data behind the interactive charts, keyed by chart id
The shared scripts at the bottom of every page are in partials/scripts.html.

Navigation and footer are taken from the live home page (index.html), so they stay in sync.

Usage:
  python3 tools/case-studies/build.py            write all pages
  python3 tools/case-studies/build.py --check    exit 1 if any page would change (no writes)
"""
import html, json, os, re, sys
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
DATA = os.path.join(HERE, 'data')

# Bump when styles.css / case-study.css / case-charts.js change, so browsers fetch the new files.
ASSET_VERSION = '20261101-noserif'


def load(name):
    with open(os.path.join(DATA, name), encoding='utf-8') as f:
        return json.load(f, object_pairs_hook=OrderedDict)


P = load('projects.json')
UI_DE = load('ui-de.json')
ICONS = load('icons.json')
CHART_DATA = load('chart-data.json')
with open(os.path.join(HERE, 'partials', 'scripts.html'), encoding='utf-8') as f:
    SCRIPTS = f.read()
with open(os.path.join(ROOT, 'index.html'), encoding='utf-8') as f:
    HOME = f.read()


def strip_tags(s):
    return re.sub('<[^>]+>', '', s)


def icon(name):
    return f'<span class="cs-icon"><svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg></span>'


def nav():
    """The home page's top bar, with links pointed back at the home page."""
    h = re.search(r'<header class="topbar">.*?</header>', HOME, re.S).group(0)
    h = h.replace('<span class="nav-indicator" aria-hidden="true"></span>', '')
    h = h.replace(' is-active', '')
    h = re.sub(r'href="#', 'href="/#', h)
    h = re.sub(r'href="public/', 'href="/public/', h)
    return h


def contact():
    """The home page's contact section + footer; 'Back to top' targets this page's hero."""
    c = re.search(r'  <section class="contact" id="contact">.*?</section>', HOME, re.S).group(0)
    c = c.replace('<button class="privacy-settings-trigger" type="button">Privacy settings</button>', '')
    c = c.replace('href="#profile"', 'href="#top"')
    c = re.sub(r'href="#(?!top")', 'href="/#', c)
    return c


def home_de(*fragments):
    """German for every data-i18n key used in the shared nav/footer, from the home page's dictionary."""
    body = HOME[HOME.index('const translations={de:{') + len('const translations={de:{'):]
    body = body[:body.index('},en:{}')]
    tr = {k: v.replace("\\'", "'") for k, v in re.findall(r"(\w+):'((?:[^'\\]|\\.)*)'", body)}
    found = []
    for frag in fragments:
        for k in re.findall(r'data-i18n="([^"]+)"', frag):
            if k in tr and k not in found:
                found.append(k)
    # Stable order (matches the pages as originally built); any new keys follow in page order.
    found.sort(key=lambda k: HOME_KEY_ORDER.index(k) if k in HOME_KEY_ORDER else len(HOME_KEY_ORDER))
    return OrderedDict((k, tr[k]) for k in found)


HOME_KEY_ORDER = ['profile', 'projects', 'experience', 'contact', 'resumeShort', 'connectLabel', 'connectTitle',
                  'workshops', 'education', 'awards', 'volunteering', 'backTop']


SIDE_ICONS = {
    'top': '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    'overview': '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    'challenge': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3Z"/>',
    'features': '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    'data': '<path d="M4 20h16"/><path d="M7 16v-5M12 16V6M17 16v-8"/>',
    'screens': '<rect x="3.5" y="5" width="17" height="12" rx="2"/><path d="M8 20h8M12 17v3"/>',
    'tech': '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15"/>',
    'client': '<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
    'takeaway': '<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0A2 2 0 0 0 6 22h13"/>',
}


def charts_section(p):
    c = p.get('charts')
    if not c:
        return '', OrderedDict(), ''
    de = OrderedDict(data_h=c['de_h'], data_p=c['de_p'])
    figs, data = '', OrderedDict()
    for n, it in enumerate(c['items']):
        de.update({f'c{n}l': it['de_l'], f'c{n}t': it['de_t'], f'c{n}p': it['de_p'], f'c{n}s': it['de_s']})
        data[it['id']] = CHART_DATA[it['id']]
        figs += (f'<figure class="cs-chart{" is-wide" if it["wide"] else ""}" data-chart="{it["id"]}">'
                 f'<div class="cs-chart-head"><span class="label" data-i18n="c{n}l">{it["l"]}</span><h3 data-i18n="c{n}t">{it["t"]}</h3><p data-i18n="c{n}p">{it["p"]}</p></div>'
                 f'<div class="cs-chart-ctl"></div><div class="cs-chart-plot"></div><p class="cs-chart-src" data-i18n="c{n}s">{it["s"]}</p></figure>')
    sec = (f'<section class="cs-plain" id="data"><span class="label" data-i18n="ui_data">In the data</span>'
           f'<h2 data-i18n="data_h">{c["h"]}</h2><p class="cs-lede" data-i18n="data_p">{c["p"]}</p><div class="cs-charts">{figs}</div></section>')
    script = ('<script type="application/json" id="cs-chart-data">' + json.dumps(data, ensure_ascii=False).replace('</', '<\\/') + '</script>\n'
              f'<script src="/case-charts.js?v={ASSET_VERSION}" defer></script>')
    return sec, de, script


def page(p, nxt):
    url = f'https://abdulhabeeb.com/projects/{p["slug"]}/'
    title = f'{p["title"]} — Case study · Abdul Habeeb'
    desc = strip_tags(p['summary'])
    links = ''
    if p.get('live'):
        key = 'ui_open_proto' if p.get('live_label') else 'ui_open'
        links += f'<a class="button is-solid" href="{p["live"]}" target="_blank" rel="noopener"><b class="btn-text" data-i18n="{key}">{p.get("live_label", "Open project")}</b> <span>↗</span></a>'
    if p.get('repo'):
        links += f'<a class="button is-ghost" href="{p["repo"]}" target="_blank" rel="noopener">Repository <span>↗</span></a>'
    meta = ''.join(f'<div><dt data-i18n="ui_meta{i}">{k}</dt><dd data-i18n="meta{i}">{v}</dd></div>' for i, (k, v) in enumerate(p['meta']))
    feats = ''.join(f'<article class="cs-card">{icon(i)}<h3 data-i18n="f{n}t">{t}</h3><p data-i18n="f{n}d">{d}</p></article>' for n, (i, t, d) in enumerate(p['features']))
    ch_t, ch_l = p['challenge']
    so_t, so_l = p['solution']
    li = lambda xs, pre: ''.join(f'<li data-i18n="{pre}{n}">{x}</li>' for n, x in enumerate(xs))
    gallery = ''
    if p['gallery']:
        items = ''.join(f'<figure class="cs-shot{" is-wide" if w else ""}"><img src="{src}" alt="{cap}" loading="lazy" decoding="async" /><figcaption data-i18n="g{n}">{cap}</figcaption></figure>' for n, (src, cap, w) in enumerate(p['gallery']))
        gallery = f'<section class="cs-plain" id="screens"><span class="label" data-i18n="ui_screens">Screens</span><h2 data-i18n="ui_screens_h">A closer look <span>at the product.</span></h2><div class="cs-gallery">{items}</div></section>'
    phone = ''
    if p.get('phone'):
        src, h3, txt = p['phone']
        pts = ''.join(f'<li data-i18n="pt{n}">{x}</li>' for n, x in enumerate(p.get('points', [])))
        phone = f'<div class="cs-phone"><div class="cs-phone-stage"><figure class="cs-shot"><img src="{src}" alt="{p["title"]} on a phone" loading="lazy" decoding="async" /></figure></div><div class="cs-phone-copy"><span class="label" data-i18n="ui_responsive">Responsive</span><h3 data-i18n="ph_h">{h3}</h3><p data-i18n="ph_p">{txt}</p><ul class="cs-checks">{pts}</ul></div></div>'
    tech = ''.join(f'<li><strong data-i18n="t{n}k">{k}</strong><span data-i18n="t{n}v">{v}</span></li>' for n, (k, v) in enumerate(p['tech']))
    stack = ''.join(f'<span>{s}</span>' for s in p['stack'])
    quote = ''
    if p.get('quote'):
        q, name, role = p['quote']
        quote = f'<section class="cs-panel" id="client"><span class="label" data-i18n="ui_client">Client words</span><blockquote class="cs-quote">{q}<footer><strong>{name}</strong> · {role}</footer></blockquote></section>'
    ov_src, ov_cap = p['ov_img']
    charts_sec, charts_de, charts_js = charts_section(p)

    the_nav, the_contact = nav(), contact()
    de = OrderedDict(UI_DE)
    de.update(home_de(the_nav, the_contact))
    de.update(p.get('de', {}))
    de.update(charts_de)
    if nxt.get('de', {}).get('summary'):
        de['next_summary'] = strip_tags(nxt['de']['summary'])
    de_json = json.dumps(de, ensure_ascii=False).replace('</', '<\\/')

    sn = [('top', 'Intro'), ('overview', 'Overview'), ('challenge', 'Challenge &amp; solution'), ('features', 'Key features')]
    if charts_sec: sn.append(('data', 'In the data'))
    if p['gallery']: sn.append(('screens', 'Screens'))
    sn.append(('tech', 'How it works'))
    if p.get('quote'): sn.append(('client', 'Client words'))
    sn.append(('takeaway', 'What I learned'))
    sidenav = ('<button class="cs-sidetab" type="button" aria-expanded="false" aria-controls="csSidenav" aria-label="Jump to section"><span class="cs-sidetab-icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + SIDE_ICONS['top'] + '</svg></span></button>'
               + '<nav class="cs-sidenav" id="csSidenav" aria-label="Case study sections"><span class="cs-sidenav-indicator" aria-hidden="true"></span>'
               + ''.join(f'<a href="#{i}" aria-label="{t}"><svg viewBox="0 0 24 24" aria-hidden="true">{SIDE_ICONS[i]}</svg><span class="cs-tip" data-i18n="sn_{i}">{t}</span></a>' for i, t in sn)
               + '</nav>')
    ld = {"@context": "https://schema.org", "@type": "CreativeWork", "name": p['title'], "description": desc, "url": url,
          "image": "https://abdulhabeeb.com" + p['thumb'], "author": {"@type": "Person", "name": "Abdul Habeeb", "url": "https://abdulhabeeb.com/"}}
    scripts = SCRIPTS.replace('__PAGE_DE__', de_json).replace('__CHARTS__', charts_js)

    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <link rel="canonical" href="{url}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{html.escape(p['title'])} — Case study" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="https://abdulhabeeb.com{p['thumb']}" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v={ASSET_VERSION}" />
  <link rel="stylesheet" href="/case-study.css?v={ASSET_VERSION}" />
  <script>try{{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark-pre')}}catch(e){{}}</script>
</head>
<body>
<main class="cs-page">
  {the_nav}
  {sidenav}
  <section class="cs-hero" id="top">
    <img class="cs-hero-bg" src="{p['hero']}" alt="" />
    <a class="cs-back" href="/#projects" data-i18n="ui_back">← All projects</a>
    <div>
      <span class="label" data-i18n="label">{p['label']}</span>
      <h1>{p['title']}</h1>
      <p data-i18n="summary">{p['summary']}</p>
      <div class="cs-hero-actions">{links}</div>
    </div>
  </section>

  <dl class="cs-meta">{meta}</dl>

  <section class="cs-panel" id="overview">
    <span class="label" data-i18n="ui_overview">Overview</span>
    <h2 data-i18n="ov_h">{p['ov_h']}</h2>
    <p class="cs-lede" data-i18n="ov_p">{p['ov_p']}</p>
    <figure class="cs-shot"><img src="{ov_src}" alt="{ov_cap}" loading="lazy" decoding="async" /><figcaption data-i18n="ov_cap">{ov_cap}</figcaption></figure>
  </section>

  <section class="cs-plain" id="challenge">
    <span class="label" data-i18n="ui_challenge">Challenge &amp; solution</span>
    <h2 data-i18n="ui_challenge_h">What made it hard, <span>and how I approached it.</span></h2>
    <div class="cs-split">
      <article><span class="label" data-i18n="ui_the_challenge">The challenge</span><h3 data-i18n="ch_t">{ch_t}</h3><ul>{li(ch_l, 'ch')}</ul></article>
      <article class="is-solution"><span class="label" data-i18n="ui_the_solution">The solution</span><h3 data-i18n="so_t">{so_t}</h3><ul>{li(so_l, 'so')}</ul></article>
    </div>
  </section>

  <section class="cs-panel" id="features">
    <span class="label" data-i18n="ui_features">Key features</span>
    <h2 data-i18n="ui_features_h">Built around <span>what people actually need.</span></h2>
    <div class="cs-cards">{feats}</div>
    {phone}
  </section>

  {charts_sec}

  {gallery}

  <section class="cs-panel" id="tech">
    <span class="label" data-i18n="ui_tech">How it works</span>
    <h2 data-i18n="ui_tech_h">Under the hood.</h2>
    <ul class="cs-list">{tech}</ul>
    <div class="cs-stack">{stack}</div>
  </section>

  {quote}

  <section class="cs-plain" id="takeaway">
    <span class="label" data-i18n="ui_takeaway">Takeaway</span>
    <h2 data-i18n="ui_learned_h">What I learned.</h2>
    <p class="cs-lede" data-i18n="learned">{p['learned']}</p>
  </section>

  <a class="cs-next" href="/projects/{nxt['slug']}/">
    <div><span class="label" data-i18n="ui_next">Next project</span><h2>{nxt['title']}</h2><p data-i18n="next_summary">{strip_tags(nxt['summary'])}</p><span class="button is-solid"><b class="btn-text" data-i18n="ui_view_case">View case study</b> <span>→</span></span></div>
    <div class="cs-next-img"><img src="{nxt['thumb']}" alt="" loading="lazy" decoding="async" /></div>
  </a>

{the_contact}
</main>
{scripts}</body>
</html>
'''


def main():
    check = '--check' in sys.argv
    changed = []
    for i, p in enumerate(P):
        out = page(p, P[(i + 1) % len(P)])
        path = os.path.join(ROOT, 'projects', p['slug'], 'index.html')
        old = open(path, encoding='utf-8').read() if os.path.exists(path) else None
        if old != out:
            changed.append(p['slug'])
            if not check:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(out)
    if check:
        print('up to date' if not changed else 'would change: ' + ', '.join(changed))
        sys.exit(1 if changed else 0)
    print(f'built {len(P)} pages' + (f' ({len(changed)} changed: {", ".join(changed)})' if changed else ' (no changes)'))


if __name__ == '__main__':
    main()
