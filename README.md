# Climate Resilient UK — Community risk

A static prototype with two interfaces drawing from shared data. The local collection covers England and Wales.

## Pages

After the GitHub repository is renamed to `communityrisk`, the intended addresses are:

- `https://pedrito1414.github.io/communityrisk/` — project introduction and menu.
- `https://pedrito1414.github.io/communityrisk/registers/` — full risk register dashboard.
- `https://pedrito1414.github.io/communityrisk/bypostcode/` — postcode finder.

All internal links are relative. The same files also work under the current repository address, or another static hosting directory. The former home-page dashboard has moved to `registers/`.

## Structure

- `index.html`: project home page.
- `registers/index.html`, `bypostcode/index.html`: interface markup.
- `assets/`: page styling, interface code, shared data loading, ranking rules and geographic lookup.
- `data/`: the shared collection, documented in [data/README.md](data/README.md).
- `tools/validate.py`: checks data references, ranges, identifiers and local file links.
- `tests/`: browser checks using Python, Chromium and ChromeDriver; no Python packages required.

There is no application server, package installation or build step. JavaScript modules load JSON files over HTTP; opening the pages directly with `file://` will not work.

## Run locally

From this folder:

```sh
python3 tools/validate.py
python3 -m http.server 8000
```

Open `http://localhost:8000/`, then use the menu. To run browser checks (with Chromium and ChromeDriver installed):

```sh
python3 tests/browser_checks.py
```

For an additional check against real Postcodes.io responses, Leaflet styling and OpenStreetMap tiles, run `python3 tests/browser_checks.py --live` (requires internet access).

The browser checks start their own temporary HTTP server and browser driver. Postcode responses and unavailable external map services are simulated so the checks do not depend on internet access.

## Updating data

Edit the files in `data/`, not the interface JavaScript. Forum codes connect risks, area metadata, maps and national matches. Preserve stable risk IDs. Update the downloadable `risk-matches.csv` when editing `risk-matches.json`; the validator checks they agree. Run validation and browser checks before publishing.

The original 42 areas, 631 local entries, 95 national entries and 631 match records have been preserved, including later additions and corrections to the original inline dataset. Their transcription has not been independently audited. Source dates, coverage and caveats remain attached to the records. Source records are snapshots, not automatically refreshed feeds.

## GitHub Pages

This checkout does not control the repository's GitHub Pages settings.

1. To use `/communityrisk/`, rename the GitHub repository to `communityrisk` in its settings, and update your local Git remote to the new repository URL.
2. In **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**.
3. Commit and push the complete project, including `assets/` and `data/`. No custom build workflow is required.
4. Check the Pages deployment result and the three page addresses above.

The repository rename changes the website path. Update external links and check old bookmarks after the change. Nothing in this local implementation renames the repository or publishes automatically.

## External services and limits

The postcode finder sends a submitted postcode to Postcodes.io to obtain its location. It matches that location against the same stored ONS boundaries used by the dashboard, using official forum codes. A shared link prefills the postcode; it is not submitted automatically. The postcode appears in the page URL after a successful lookup. The application does not store postcode searches in a database.

Leaflet from unpkg and OpenStreetMap background tiles are optional external map resources. If Leaflet cannot load, a local SVG shows the boundary and postcode marker. If background tiles fail, the boundary overlay remains usable. A postcode service failure shows an error and removes previous results rather than showing a stale area's risks.

This is a public test prototype. Coverage is incomplete, national excerpts include known PDF extraction defects, national matches are provisional, and sources differ in assessment methods. The common 1–5 navigation rank is not an official score or personal risk estimate. Before public promotion, validate sources, descriptions, scores, links and accessibility. Do not collect household personal data in this prototype.
