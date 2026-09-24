# mikail.xyz — temporary holding page

Deliberately simple under-construction page while the full site is rebuilt.

## Public page

Visible content only:
- Round profile image from `avatar.jpg` (falls back to a plain “M” circle if missing)
- Name: **Mikail**
- “Site under construction. Back soon.”
- One link: [GitHub](https://github.com/MikailR)

## Upload a profile image

Unlisted admin (not linked from the public page):

https://mikailr.github.io/GUI/previews/holding/admin/

1. Create a **fine-grained** GitHub PAT with **Contents: Read and write** on `MikailR/GUI` (or the production repo once you switch).
2. Paste the token → **Store token** (saved in `localStorage` only).
3. Pick a photo → preview (center-cropped 512px JPEG) → **Upload & commit**.
4. Wait ~1 minute for GitHub Pages to refresh, then hard-reload the public page.

**Forget token** clears the PAT from this browser.

### Repoint to production later

In `admin/index.html`, edit the `CONFIG` object at the top of the script:

```js
var CONFIG = {
  owner: "0xGershwin",
  repo: "mikail.xyz",
  branch: "main",
  path: "assets/avatar.jpg",   // or wherever production expects it
  // …
};
```

The Target fields on the admin form are also editable at runtime.

## Open locally

```bash
cd mikail-holding
python3 -m http.server 8765
# → http://localhost:8765
# → http://localhost:8765/admin/
```

## Demo

- Public: https://mikailr.github.io/GUI/previews/holding/
- Admin: https://mikailr.github.io/GUI/previews/holding/admin/

Does **not** touch mikail.xyz production.
