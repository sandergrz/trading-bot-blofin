// Schematische geometrie + kennisdata voor het differentieel van een BMW E36.
// Coordinatensysteem (meters): x = links/rechts (naar de wielen), z>0 richting cardanas.

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeTorus, makeSphere } from "./helpers.js";

export const meta = {
  id: "differentieel",
  name: "Differentieel & achteras",
  short: "Diff",
  description:
    "Kroonwiel, pignon en de differentieelkooi — met een blik op waarom bijna elke E36 drift-build een sperdifferentieel (LSD) heeft.",
  cameraPosition: [1.6, 1.0, 1.6],
  cameraTarget: [0, 0, 0],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "differentieelhuis",
    name: "Differentieelhuis",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox([0, 0, 0], [0.36, 0.32, 0.34], 0x4a5568),
    explodeOffset: [0, -0.9, 0],
    info: {
      functie:
        "Huisvest het kroonwiel, het pignon en de differentieelkooi. Verdeelt het motorkoppel tussen de twee achterwielen en verandert de draairichting 90 graden — van de langsliggende cardanas naar de dwarsliggende aandrijfassen.",
      volgorde:
        "Wordt als complete, voorgemonteerde eenheid in de achterasdraagbalk geplaatst, vóórdat de aandrijfassen worden aangesloten.",
      fouten:
        "Het huis zonder de juiste pakkingen of voorspanning terugplaatsen na een revisie, wat lekkage of een verkeerde tandwielspeling geeft.",
    },
  });

  const ringGearCenter = [0.05, 0, 0];
  defs.push({
    id: "kroonwiel-pignon",
    name: "Kroonwiel & pignon",
    order: 2,
    color: 0x8a94a3,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeTorus(ringGearCenter, 0.12, 0.02, 0x8a94a3, { axis: "x", metalness: 0.6 }));
      group.add(makeCylinder([0, 0, 0.15], 0.045, 0.1, 0x8a94a3, { axis: "z", metalness: 0.6 }));
      return group;
    })(),
    explodeOffset: [0, 0.4, 0.8],
    info: {
      functie:
        "Dit tandwielpaar zorgt voor de eindoverbrenging (final drive ratio) en verandert de draairichting van de aandrijflijn. Een kortere (hoger getallige) overbrenging geeft feller optrekken maar een lagere eindsnelheid — een populaire drift-aanpassing om de motor sneller in het toerenbereik te krijgen dat prettig is voor gecontroleerde slip.",
      volgorde:
        "Als een op elkaar ingeslepen paar (matched set) gemonteerd — nooit los van elkaar vervangen.",
      fouten:
        "Kroonwiel en pignon los van elkaar vervangen in plaats van als ingeslepen set — de tandflanken passen dan niet precies op elkaar, wat lawaai en versnelde slijtage geeft.",
    },
  });

  const cageGroup = new THREE.Group();
  const cageRadius = 0.06;
  [
    [cageRadius, 0, 0],
    [-cageRadius, 0, 0],
    [0, cageRadius, 0],
    [0, -cageRadius, 0],
  ].forEach((offset) => {
    cageGroup.add(makeSphere(offset, 0.035, 0xd0a23a, { metalness: 0.6, roughness: 0.3 }));
  });
  defs.push({
    id: "differentieelkooi",
    name: "Differentieelkooi (sperfunctie / LSD)",
    order: 3,
    color: 0xd0a23a,
    mesh: cageGroup,
    explodeOffset: [-0.6, 0.2, 0.3],
    info: {
      functie:
        "Verdeelt het koppel over beide wielen en laat ze in bochten met verschillende snelheid draaien. Een open differentieel stuurt bij wielslip — bijvoorbeeld tijdens een drift — het meeste koppel naar het wiel met de minste grip. Daarom rijdt vrijwel elke serieuze E36 drift-build met een sperdifferentieel (LSD), dat koppel blijft verdelen ook als één wiel doorslipt.",
      volgorde:
        "Als kern van het differentieelhuis gemonteerd, vóór het sluiten van het huis.",
      fouten:
        "Een LSD monteren zonder de juiste (vaak dikkere) differentieelolie met LSD-additief — zonder additief kan de sperkoppeling gaan schokken of piepen in bochten.",
    },
  });

  defs.push({
    id: "ingaande-flens",
    name: "Ingaande flens (cardanas-aansluiting)",
    order: 4,
    color: 0x707070,
    mesh: makeCylinder([0, 0, 0.24], 0.06, 0.03, 0x707070, { axis: "z", metalness: 0.6 }),
    explodeOffset: [0, 0, 0.9],
    info: {
      functie:
        "Verbindt de cardanas met het pignon en brengt zo het motorkoppel het differentieel in.",
      volgorde:
        "Op het pignon gemonteerd tijdens de opbouw van het huis, vóórdat de cardanas wordt aangesloten.",
      fouten:
        "De flensmoer niet op het (zeer hoge) voorgeschreven aandraaimoment vastzetten — deze verbinding bepaalt mede de voorspanning van de pignonlagers.",
    },
  });

  defs.push({
    id: "diff-lagers",
    name: "Diff-lagers",
    order: 5,
    color: 0x6e7889,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeTorus([0.14, 0, 0], 0.06, 0.015, 0x6e7889, { axis: "x", metalness: 0.6 }));
      group.add(makeTorus([-0.14, 0, 0], 0.06, 0.015, 0x6e7889, { axis: "x", metalness: 0.6 }));
      return group;
    })(),
    explodeOffset: [0, -0.5, -0.6],
    info: {
      functie:
        "Dragen de differentieelkooi in het huis en zorgen voor een nauwkeurige, speling-vrije uitlijning van het kroonwiel ten opzichte van het pignon.",
      volgorde:
        "Bij de opbouw van het huis gemonteerd, met een voorspanning die precies met pasplaatjes (shims) wordt afgesteld.",
      fouten:
        "De lagervoorspanning niet correct instellen met shims — te veel speling geeft lawaai en klepperen, te weinig speling laat de lagers snel oververhitten en verslijten, zeker onder de piekbelasting van herhaalde clutch kicks.",
    },
  });

  defs.push({
    id: "uitgaande-flenzen",
    name: "Uitgaande flenzen (naar aandrijfassen)",
    order: 6,
    color: 0x707070,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeCylinder([0.22, 0, 0], 0.05, 0.04, 0x707070, { axis: "x", metalness: 0.6 }));
      group.add(makeCylinder([-0.22, 0, 0], 0.05, 0.04, 0x707070, { axis: "x", metalness: 0.6 }));
      return group;
    })(),
    explodeOffset: [0, 0.3, -0.8],
    info: {
      functie:
        "Verbinden de differentieelkooi met de aandrijfassen naar beide achterwielen.",
      volgorde:
        "Aan weerszijden van de differentieelkooi gemonteerd, vlak vóór het sluiten van het huis.",
      fouten:
        "De keerringen rond de uitgaande flenzen beschadigen bij montage — een veelvoorkomende oorzaak van een langzaam lekkend differentieel.",
    },
  });

  defs.push({
    id: "diff-olie",
    name: "Differentieelolie & vulplug",
    order: 7,
    color: 0x3ba76b,
    mesh: makeCylinder([0, -0.17, 0.02], 0.02, 0.03, 0x3ba76b, { axis: "y", metalness: 0.3 }),
    explodeOffset: [0.3, -0.5, 0.2],
    info: {
      functie:
        "Smeert en koelt de tandwielen en lagers in het differentieel. Bij een LSD bevat de olie een speciaal additief dat nodig is voor een soepel werkende sperkoppeling.",
      volgorde:
        "Als laatste stap bijgevuld, nadat het huis gesloten en in de achterasdraagbalk gemonteerd is.",
      fouten:
        "Gewone versnellingsbakolie gebruiken in plaats van de juiste (vaak GL-5) differentieelolie mét LSD-additief — dit versnelt slijtage van de sperkoppeling en kan schokkerig gedrag in bochten geven.",
    },
  });

  defs.push({
    id: "diff-montage",
    name: "Diff-montagebeugels",
    order: 8,
    color: 0x2f3644,
    mesh: makeLink([0, -0.16, -0.1], [0, -0.42, -0.15], 0.035, 0x2f3644),
    explodeOffset: [0, -0.8, -0.3],
    info: {
      functie:
        "Bevestigen het differentieel stevig aan de achterasdraagbalk en isoleren trillingen richting de carrosserie.",
      volgorde:
        "Gemonteerd op het moment dat het differentieel in de achterasdraagbalk wordt geplaatst.",
      fouten:
        "De rubberen diff-mount is een berucht zwak punt bij hard optrekken en clutch kicks: hij kan scheuren of loslaten, voelbaar als een 'klonk' bij het aankoppelen van de motor. Veel drift-builds vervangen hem daarom door een verstevigde of volledig starre (solid) mount.",
    },
  });

  return defs;
}
