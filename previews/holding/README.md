# mikail.xyz — temporary holding page

Deliberately simple under-construction page while the full site is rebuilt.

## Files

| File | Role |
|---|---|
| `index.html` | Public page: photo, name, headline, GitHub link. Inline CSS/JS. |
| `site.json` | `{ "headline": "...", "avatarVersion": "..." }`, read by the public page on every load. |
| `avatar.jpg` | Profile photo (512px JPEG, written by the admin). Missing = plain "M" circle. |
| `admin/index.html` | Unlisted editor (noindex, not linked from the public page). |
| `favicon.svg` | Favicon. |

The public page fetches `site.json` with `cache: "no-store"`, sets the headline via
`textContent` (plain text), and loads `avatar.jpg?v=<avatarVersion>`. If `site.json`
can't be fetched, the headline hardcoded in the HTML ("Site under construction. Back soon.")
stays and the photo is still attempted.

Why the version stamp: GitHub Pages serves files with `max-age=600`, and its CDN ignores
query strings. Pages purges the CDN on each deploy, so the only stale copy left is the
one in your browser, and a new `?v=` value always bypasses it. `avatarVersion` is the
first 12 characters of the photo's git blob sha, so the same photo always gets the same version.

## Editing (admin)

https://mikailr.github.io/GUI/previews/holding/admin/

1. Paste a **fine-grained** GitHub token with **Contents: Read and write** on the target repo and click **Store token**. It's kept in this browser's `localStorage` only. **Forget token** removes it.
2. **Headline**: edit the text, then **Save headline** (commits `site.json` only).
3. **Photo**: choose an image, drag to position, zoom with the slider, pinch, or scroll wheel,
   then **Upload photo**. The avatar and the new `avatarVersion` go out in one commit.

After a save, the admin polls the live site every 5s (up to 3 min). It shows
"Committed, waiting for GitHub Pages to publish…" and then **Live**, or a plain
timeout message with links to the commit and Actions.

Safeguards:
- Buttons lock while a save is in flight. Upload stays disabled after success until you change the crop or pick a new file.
- If the result would be identical to what's already committed, nothing is committed ("No change").
  The old admin re-PUT the same bytes through the Contents API, and GitHub still records that as an empty commit.
- Commits go through the Git Data API (blob, tree, commit, then a non-force ref update).
  If the branch moved during the save, it rebuilds on the new head.

## Repoint to production

Edit the `CONFIG` object at the top of the script in `admin/index.html`:

```js
var CONFIG = {
  owner: "0xGershwin",
  repo: "mikail.xyz",
  branch: "main",
  dir: "",            // folder holding index.html/site.json/avatar.jpg; "" = repo root
  publicUrl: null,    // null = the folder above /admin/ (correct when deployed together)
  ...
};
```

The **Target** section in the admin can also override these for a single session.

## Open locally

```bash
cd mikail-holding
python3 -m http.server 8765
# http://localhost:8765  and  http://localhost:8765/admin/
```

(Saving from a local copy still commits to the configured repo. Live polling watches `publicUrl`.)
