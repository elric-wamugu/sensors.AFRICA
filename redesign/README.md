# sensors.AFRICA — redesign prototype (CfA design system)

Static-HTML prototype of the sensors.AFRICA site redesign — homepage plus 8 inner
pages — moving from the previous dark editorial theme to the **Code for Africa
design system**: clean white surfaces, Inter / Inter Display type, CfA Blue
(`#0B2AEA`) structural accents, borders over shadows, pure-black footer.

Built from the Claude Design handover bundle ("Sensors.Africa redesign review").
Intended as a high-fidelity design reference for implementing the redesign in the
production React app.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Homepage — blue hero (selected default variant), four monitoring streams, Leaflet network map, 24-h Nairobi trend chart, WHO stats, story showcase, how it works, **floating auto-cycling air-quality widget** |
| `air.html` | Air stream — live-reading hero bound to the selected city, 6-city dashboard tabs driving a dynamic 24-h SVG chart, 17-city ranked bars, Leaflet map, 6 health-band guidance cards, hardware spec. Supports `?city=` (e.g. `air.html?city=lagos`) |
| `water.html` / `sound.html` / `radiation.html` | "Coming soon" stream pages — blue hero with gold pill, planned-measurements card, why-it-matters editorial, notify-me CTA |
| `data.html` | Open data — embeddable widget cards (map / graph / dial), API + archives, licence & provenance |
| `stories.html` | Editorial masthead ("Data as testimony."), StormWatch lead story, 6-story index, Medium CTA, prototype newsletter |
| `about.html` | Our story, partner fact cards, project cards, media partners, team, where we work |
| `get-started.html` | Three pathways, 4 hosting steps, hardware kit table, single-open FAQ accordion |

## Structure

- `assets/css/cfa-tokens.css` — CfA design-system tokens (Untitled UI v8 base, CfA blue brand ramp)
- `assets/css/cfa-site.css` — CfA marketing-site UI kit (buttons, header, sections)
- `assets/css/prototype.css` — page styles shared across the prototype (hero, band meter, widget, footer, hovers)
- `assets/js/site.js` — shared chrome (header/footer), US EPA PM2.5 band logic, Leaflet map init, floating widget
- `assets/img/logo-white.png` — white logomark (CSS-inverted in the white header; production should use a proper dark logo asset)

## Notes

- **All readings are illustrative sample data.** Production should bind to the
  live sensors.AFRICA API (`api.sensors.africa`) and derive health bands from
  PM2.5 via US EPA breakpoints (see `saBand()` in `assets/js/site.js`).
- Fonts load from Google Fonts (Inter). "Inter Display" falls back to Inter;
  production can self-host both families.
- Maps: Leaflet 1.9.4 + CARTO `light_all` basemap (attribution required), loaded
  from CDN — pages need network access for tiles/fonts/Leaflet.
- Story/lead images are placeholders — real photography to be supplied.
- Newsletter and notify-me forms are prototype-only (nothing is sent or stored);
  application CTAs point at the existing Google Form.

View locally with any static server, e.g. `python3 -m http.server` from this
directory, then open `http://localhost:8000/`.
