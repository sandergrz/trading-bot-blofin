# BMW E36 — Interactief Samenstellingsplan

Interactieve 3D-visualisatie van de belangrijkste mechanische systemen van een
BMW E36: klik op een onderdeel voor uitleg (functie, montagevolgorde en
veelgemaakte fouten), en demonteer/monteer een heel systeem of een los
onderdeel om te zien hoe alles in elkaar zit.

Dit is bedoeld als naslagwerk tijdens het sleutelen, niet als exacte
technische tekening: de vormen zijn vereenvoudigde, schematische primitieven
(kubussen, cilinders, een veerhelix, gebogen buizen) in de juiste onderlinge
verhouding en positie — geen fotorealistisch model.

## Systemen

Bovenin de app kun je tussen elf deelsystemen wisselen:

1. **Voorwielophanging** — McPherson-veerpoot: draagarm, kogelgewricht, veer, demper, spoorstang.
2. **Achterwielophanging** — semi-trailing arm: draagarm, aandrijfas, veer/demper, handremtrommel-in-schijf.
3. **Remsysteem** — het complete, diagonaal gesplitste circuit: pedaal, bekrachtiger, hoofdremcilinder, ABS, leidingen, handrem.
4. **Stuurinrichting** — stuurwiel, kolom, stuurhuis en de hydraulische bekrachtiging.
5. **Motor** — op blokniveau: krukas, zuigers, cilinderkop, distributie, hulpstukken.
6. **VANOS-eenheid** — de variabele nokkenastiming van de M50TU/M52/S50, met net iets meer detail (dit was het oorspronkelijke idee achter de tool).
7. **Koelsysteem** — radiateur, slangen, thermostaat, waterpomp, ventilator/viscokoppeling.
8. **Koppeling & versnellingsbak** — vliegwiel, koppelingsplaat, drukgroep, bak, hydrauliek.
9. **Differentieel & achteras** — kroonwiel, pignon, differentieelkooi (LSD), diff-mounts.
10. **Uitlaatsysteem** — van downpipe tot einddemper, met katalysator en lambdasonde.
11. **Brandstofsysteem** — van tank tot injector, met pomp, filter, rail en drukregelaar.

Elk systeem is gevuld met echte, herkenbare E36- en drift-build-kennis (denk
aan de VANOS-rattle, subframe- en diff-mount-slijtage, de populaire S54-swap,
clutch kicks, LSD-olie, cat-delete-legaliteit, etc.) — niet alleen generieke
autotechniek.

Bewust buiten scope: elektrisch bedradingssysteem, carrosserie/interieur en
airconditioning. Dit blijven mechanische, "aanklikbare" systemen; een
bedradingsboom leent zich niet goed voor dezelfde explode/assemble-aanpak.

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

- **Tabs bovenin** wisselen tussen de elf deelsystemen; elk systeem heeft zijn
  eigen camerastandpunt en onderdelenlijst.
- **Slepen** = camera draaien, **scrollen** = in-/uitzoomen (via OrbitControls).
- **Klik op een onderdeel** (in het 3D-model of in de lijst rechts) om het te
  selecteren en de info te zien.
- **"Demonteer dit onderdeel" / "Monteer dit onderdeel"** in het infopaneel
  beweegt alleen het geselecteerde onderdeel.
- **"Demonteer alles" / "Monteer alles"** speelt een exploded-view-animatie af
  van het hele systeem, in (omgekeerde) montagevolgorde.
- **Demontagegraad-slider** geeft handmatige controle over hoe ver alles uit
  elkaar staat.

## Techniek

- [Three.js](https://threejs.org/) (WebGL), vendored in `vendor/three/` zodat
  de app volledig los van internet werkt.
- Geen build-stap: platte HTML/CSS/JS-modules, direct te openen via een
  statische server.
- `systems/helpers.js` bevat gedeelde geometrie-helpers (staven, cilinders,
  torussen, veerhelix, gebogen buizen) die door alle systemen gebruikt worden.
- Elk bestand in `systems/` (bijvoorbeeld `front-suspension.js` of `vanos.js`)
  exporteert `meta` (naam, beschrijving, camerastandpunt) en `createParts()`
  (de geometrie + kennisdata per onderdeel). `systems/registry.js` bundelt ze
  allemaal.
- `main.js` bouwt de scene, de systeem-tabs, regelt selectie/raycasting en de
  explode/assemble-animaties, en herlaadt een compleet nieuw systeem (inclusief
  het opruimen van de vorige geometrieën) bij het wisselen van tab.

## Een systeem toevoegen

Nieuw deelsysteem toevoegen (bijvoorbeeld de airco, of het elektrische
bedradingsschema als abstract blokschema): maak een nieuw bestand in
`systems/`, volg de structuur van een bestaand systeem (`meta` + createParts()
met een array van onderdelen: geometrie, positie, `explodeOffset` en de
functie/volgorde/fouten-tekst), en registreer het in `systems/registry.js`.
