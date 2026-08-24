// Schematische geometrie + kennisdata voor de stuurinrichting van een BMW E36
// (stuurwiel -> kolom -> stuurhuis, plus de hydraulische bekrachtiging).
// De spoorstangen zelf staan in het voorwielophanging-systeem.
//
// Coordinatensysteem (meters): x=0 hart van de auto, y=0 vloerhoogte, z=0 firewall
// (z>0 het interieur in, z<0 naar voren/de motorruimte in).

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "stuurinrichting",
  name: "Stuurinrichting",
  short: "Sturen",
  description:
    "Stuurwiel, kolom, stuurhuis (rack & pinion) en de hydraulische bekrachtiging — inclusief de populaire E36 M3 quick-ratio-rack-swap.",
  cameraPosition: [2.8, 1.9, 2.7],
  cameraTarget: [0.4, 0.2, 0],
};

export function createParts() {
  const defs = [];

  const wheelCenter = [0.3, 0.62, 0.85];
  const wheelGroup = new THREE.Group();
  wheelGroup.add(makeTorus(wheelCenter, 0.17, 0.018, 0x2f3644, { axis: "x" }));
  wheelGroup.add(makeCylinder(wheelCenter, 0.03, 0.06, 0x2f3644, { axis: "x" }));
  defs.push({
    id: "stuurwiel",
    name: "Stuurwiel",
    order: 1,
    color: 0x2f3644,
    mesh: wheelGroup,
    explodeOffset: [-0.3, 0.3, 0.6],
    info: {
      functie:
        "De interface tussen bestuurder en stuurinrichting: zet de handbeweging om in een rotatie die via de stuurkolom naar het stuurhuis gaat.",
      volgorde:
        "Als laatste gemonteerd, nadat stuurkolom en stuurhuis al op hun plek zitten en de wielen recht staan.",
      fouten:
        "Het stuurwiel niet in het midden (recht vooruit) monteren terwijl de wielen al recht staan — geeft een zichtbaar scheef stuurwiel bij rechtuit rijden, ook als het sturen zelf prima werkt.",
    },
  });

  const columnTop = [0.32, 0.55, 0.78];
  const columnJoint = [0.34, 0.3, 0.55];
  const columnBottom = [0.35, 0.05, 0.3];
  const columnGroup = new THREE.Group();
  columnGroup.add(makeLink(columnTop, columnJoint, 0.028, 0x5a6472));
  columnGroup.add(makeLink(columnJoint, columnBottom, 0.026, 0x5a6472));
  defs.push({
    id: "stuurkolom",
    name: "Stuurkolom (incl. kruiskoppeling)",
    order: 2,
    color: 0x5a6472,
    mesh: columnGroup,
    explodeOffset: [-0.5, 0.15, 0.5],
    info: {
      functie:
        "Brengt de rotatie van het stuurwiel via een kruiskoppeling — die het hoekverschil tussen kolom en stuurhuis overbrugt — naar het stuurhuis.",
      volgorde:
        "Gemonteerd tussen stuurhuis en stuurwiel, vóórdat het stuurwiel er zelf op geplaatst wordt.",
      fouten:
        "De kruiskoppeling met te veel speling laten zitten. Dat voelt als 'los' of vaag sturen rond het middelpunt — bij precisiewerk zoals corrigeren tijdens een drift is dat een merkbaar nadeel.",
    },
  });

  const rackLeft = [-0.5, -0.05, 0.3];
  const rackRight = [1.2, -0.05, 0.3];
  defs.push({
    id: "stuurhuis",
    name: "Stuurhuis (rack & pinion)",
    order: 3,
    color: 0x4a5568,
    mesh: makeLink(rackLeft, rackRight, 0.045, 0x4a5568, { metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0, -0.6, -0.6],
    info: {
      functie:
        "Zet de rotatie van de stuurkolom om in een lineaire beweging die via de spoorstangen de voorwielen laat sturen. De overbrengingsverhouding (ratio) bepaalt hoeveel stuurwielrotatie nodig is voor een bepaalde stuurhoek.",
      volgorde:
        "Eén van de eerste onderdelen die in het voorframe gemonteerd wordt, vóórdat kolom en spoorstangen worden aangesloten.",
      fouten:
        "Een bekende E36 drift-mod is het inbouwen van een 'sneller' stuurhuis — bijvoorbeeld van de E36 M3, of een aftermarket quick-ratio rack — voor snellere stuurcorrecties tijdens een drift. Een veelgemaakte fout daarbij is de spoorstanglengtes en het spoor (toe) niet opnieuw te controleren en af te stellen na de swap, wat tot onvoorspelbaar rijgedrag leidt.",
    },
  });

  defs.push({
    id: "stuurhuisrubbers",
    name: "Stuurhuisrubbers",
    order: 4,
    color: 0x2f3644,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeCylinder([rackLeft[0] + 0.25, rackLeft[1] - 0.02, rackLeft[2]], 0.04, 0.06, 0x2f3644, { axis: "z" }));
      group.add(makeCylinder([rackRight[0] - 0.25, rackRight[1] - 0.02, rackRight[2]], 0.04, 0.06, 0x2f3644, { axis: "z" }));
      return group;
    })(),
    explodeOffset: [0, -0.5, 0.5],
    info: {
      functie:
        "Bevestigen het stuurhuis trillingsvrij aan het subframe/de carrosserie, en filteren hoogfrequente trillingen uit het stuurgevoel.",
      volgorde:
        "Gemonteerd samen met, of direct na, het plaatsen van het stuurhuis zelf.",
      fouten:
        "Versleten of te zachte rubbers laten zitten — geeft speling en een minder direct stuurgevoel, precies wat je niet wil bij een drift-build waar precisie telt.",
    },
  });

  const pumpCenter = [0.65, 0.4, -0.35];
  const pumpGroup = new THREE.Group();
  pumpGroup.add(makeCylinder(pumpCenter, 0.08, 0.14, 0x6e7889, { axis: "x", metalness: 0.5, roughness: 0.4 }));
  pumpGroup.add(makeTorus([pumpCenter[0] + 0.08, pumpCenter[1], pumpCenter[2]], 0.06, 0.012, 0x2f3644, { axis: "x" }));
  defs.push({
    id: "stuurbekrachtigingspomp",
    name: "Stuurbekrachtigingspomp",
    order: 5,
    color: 0x6e7889,
    mesh: pumpGroup,
    explodeOffset: [0.5, 0.4, -0.4],
    info: {
      functie:
        "Levert de hydraulische druk — aangedreven door een riem vanaf de krukas — die het sturen lichter maakt, vooral merkbaar bij lage snelheid en stilstand.",
      volgorde:
        "Op de motor gemonteerd en aangedreven via de aandrijfriem, vóórdat de hogedrukleiding wordt aangesloten.",
      fouten:
        "De aandrijfriem verkeerd spannen: te strak versnelt lagerslijtage in de pomp, te los geeft glijden/piepen en merkbaar verminderde bekrachtiging bij het insturen.",
    },
  });

  const reservoirCenter = [0.82, 0.58, -0.3];
  defs.push({
    id: "reservoir",
    name: "Reservoir (stuurbekrachtigingsvloeistof)",
    order: 6,
    color: 0xd6dae2,
    mesh: makeCylinder(reservoirCenter, 0.06, 0.14, 0xd6dae2, { axis: "y", transparent: true, opacity: 0.6, roughness: 0.2 }),
    explodeOffset: [0.4, 0.5, 0],
    info: {
      functie:
        "Voorraadvat voor de stuurbekrachtigingsvloeistof (ATF of een specifieke PAS-vloeistof, afhankelijk van uitvoering) dat de pomp van vloeistof voorziet.",
      volgorde:
        "Gemonteerd op of nabij de pomp, met de retourleiding erop aangesloten.",
      fouten:
        "Het verkeerde type vloeistof bijvullen — ATF en specifieke stuurbekrachtigingsvloeistof zijn niet altijd uitwisselbaar en een verkeerd type kan afdichtingen in het systeem aantasten.",
    },
  });

  defs.push({
    id: "drukleiding",
    name: "Drukleiding",
    order: 7,
    color: 0xb5bdc9,
    mesh: makeCurvedTube([[pumpCenter[0] + 0.1, pumpCenter[1], pumpCenter[2]], [0.7, 0.1, 0.0], [rackRight[0] - 0.1, rackRight[1] + 0.05, rackRight[2]]], 0.012, 0xb5bdc9, { metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [0.3, 0.1, -0.3],
    info: {
      functie:
        "Voert de hogedrukvloeistof van de pomp naar het stuurhuis, waar deze via een klep de bekrachtiging levert op basis van de gevoelde stuurweerstand.",
      volgorde:
        "Aangesloten tussen pomp en stuurhuis, ná montage van beide onderdelen.",
      fouten:
        "De leiding laten schuren tegen bewegende motor- of ophangingsonderdelen, wat op termijn een drukvaste (en dus lastig te vinden) lekkage veroorzaakt.",
    },
  });

  defs.push({
    id: "retourleiding",
    name: "Retourleiding",
    order: 8,
    color: 0x9aa4b5,
    mesh: makeCurvedTube([[rackLeft[0] + 0.1, rackLeft[1] + 0.05, rackLeft[2]], [0.2, 0.2, -0.1], [reservoirCenter[0] - 0.05, reservoirCenter[1] - 0.05, reservoirCenter[2]]], 0.012, 0x9aa4b5, { metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [0.2, 0.4, -0.2],
    info: {
      functie:
        "Voert de vloeistof terug van het stuurhuis naar het reservoir, zodat het hydraulische circuit gesloten is en de pomp steeds vloeistof kan blijven aanzuigen.",
      volgorde:
        "Als laatste onderdeel van het circuit aangesloten, waarna het systeem ontlucht en het vloeistofniveau gecontroleerd wordt.",
      fouten:
        "Het systeem niet ontluchten na werkzaamheden — geeft een schuimende, klotterende stuurbekrachtiging en tijdelijk zwaar sturen bij een koude start.",
    },
  });

  return defs;
}
