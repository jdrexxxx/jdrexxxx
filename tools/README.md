# Regenerating the profile assets

Every number in the root README and in `assets/*.svg` is counted, not estimated.
To refresh after the numbers move:

```sh
cd tools
node stats.js langs.json     # language bytes across every repo this account can reach
node contrib.js              # contribution calendar -> contrib.json
node telemetry.js            # -> telemetry.svg
node banner.js               # -> banner.svg
cp telemetry.svg banner.svg ../assets/
```

Requires `gh` authenticated with `repo` scope. Bump the `?v=N` cache-buster on the
`<img>` tags in the root README whenever an SVG changes, or GitHub will serve the old one.

Both SVGs are self-contained: no external fonts, no scripts, no `foreignObject`, and every
animation animates *to* the element's own base state, so a renderer that ignores SMIL still
shows the finished graphic rather than a blank card.
