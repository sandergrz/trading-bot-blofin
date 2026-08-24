# BMW E36 — Interactieve Voorwielophanging

Interactieve 3D-visualisatie van de linker voorwielophanging van een BMW E36:
klik op een onderdeel voor uitleg (functie, montagevolgorde, veelgemaakte
fouten), en demonteer/monteer de hele opstelling of een los onderdeel om te
zien hoe alles in elkaar zit.

Dit is bedoeld als naslagwerk tijdens het sleutelen, niet als exacte
technische tekening: de vormen zijn vereenvoudigde, schematische primitieven
(kubussen, cilinders, een veerhelix) in de juiste onderlinge verhouding en
positie — geen fotorealistisch model.

## Gebruiken

Geen installatie nodig, alleen een browser. Omdat de app ES-modules gebruikt
moet ze via een lokale webserver geladen worden (niet als `file://`, dat
blokkeren browsers om CORS-redenen). Bijvoorbeeld:

```bash
python3 -m http.server 8000
# open http://localhost:8000 in de browser
```

Of met Node.js:

```bash
npx serve .
```

Of open de map met de "Live Server"-extensie van VS Code.

## Bediening

- **Slepen** = camera draaien, **scrollen** = in-/uitzoomen (via OrbitControls).
- **Klik op een onderdeel** (in het 3D-model of in de lijst rechts) om het te
  selecteren en de info te zien.
- **"Demonteer dit onderdeel" / "Monteer dit onderdeel"** in het infopaneel
  beweegt alleen het geselecteerde onderdeel.
- **"Demonteer alles" / "Monteer alles"** speelt een exploded-view-animatie af
  van de hele opstelling, in (omgekeerde) montagevolgorde.
- **Demontagegraad-slider** geeft handmatige controle over hoe ver alles uit
  elkaar staat.

## Onderdelen

Subframe, draagarm, kogelgewricht, stabilisatorstang + koppelstang, fusee &
wiellager, schokdemper, veer, veerpootlager, spoorstang/stuurkogel,
remschijf, remklauw en het wiel (als context).

## Techniek

- [Three.js](https://threejs.org/) (WebGL), vendored in `vendor/three/` zodat
  de app volledig los van internet werkt.
- Geen build-stap: platte HTML/CSS/JS-modules, direct te openen via een
  statische server.
- `parts.js` bevat de geometrie-opbouw én de kennisdata (functie,
  montagevolgorde, veelgemaakte fouten) per onderdeel.
- `main.js` bouwt de scene, regelt selectie/raycasting en de
  explode/assemble-animaties.

## Volgende stappen (niet in deze versie)

Andere deelsystemen zoals de VANOS-eenheid of het remsysteem los uitwerken,
volgens dezelfde aanpak — één systeem tegelijk, schematisch, met dezelfde
click-to-explode interactie.
