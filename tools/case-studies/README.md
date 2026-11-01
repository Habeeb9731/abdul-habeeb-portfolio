# Case-study page generator

Builds the eight pages in `/projects/<slug>/index.html` from one template, so a change
to the layout or shared scripts lands on every case study at once.

```
python3 tools/case-studies/build.py          # regenerate all pages
python3 tools/case-studies/build.py --check  # report pages that would change, write nothing
```

No dependencies beyond Python 3.

## Where things live

| What | File |
|---|---|
| Page layout (sections, hero, side nav) | `build.py` → `page()` |
| Project content, English and German (`de`) | `data/projects.json` (carousel order) |
| German for shared labels (section titles, buttons, side nav) | `data/ui-de.json` |
| Feature-card icons | `data/icons.json` |
| Data behind the interactive charts | `data/chart-data.json` |
| Scripts at the bottom of every page (language, theme, side nav, smooth scroll, reveals) | `partials/scripts.html` |
| Top navigation and footer | taken from `/index.html` at build time |

## Common edits

- **Change a project's text:** edit its entry in `data/projects.json` (English field and the
  matching key in `de`), then run the build.
- **Change CSS or `case-charts.js`:** bump `ASSET_VERSION` in `build.py` so browsers load the
  new files, then run the build.
- **Change a shared script tag or its version:** edit `partials/scripts.html`, then run the build.

Always commit the regenerated `/projects/` pages together with the data change.
