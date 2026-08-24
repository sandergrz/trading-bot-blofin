// Schematische geometrie + kennisdata voor de linker achterwielophanging van een BMW E36
// (semi-trailing arm). Zelfde coordinatenconventie als de voorwielophanging:
// x=0 wielcentrum (buiten) -> x>0 naar binnen, y=0 naafhoogte, z>0 naar voren.

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeSphere, makeCoilSpring } from "./helpers.js";

export const meta = {
  id: "achterwielophanging",
  name: "Achterwielophanging",
  short: "Achter",
  description:
    "De linker achterwielophanging (semi-trailing arm): achterasdraagbalk, draagarm, aandrijfas, veer/demper en de handremtrommel-in-schijf.",
  cameraPosition: [3.6, 2.1, 3.2],
  cameraTarget: [0.5, -0.1, 0],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "achterasdraagbalk",
    name: "Achterasdraagbalk (subframe)",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox([0.95, -0.55, 0], [0.16, 0.14, 1.35], 0x4a5568),
    explodeOffset: [0.9, -0.2, 0],
    info: {
      functie:
        "De achterasdraagbalk is een op zichzelf staand subframe dat het differentieel, de trailing arms en (indirect) de schokdempers aan de carrosserie ophangt via vier grote rubbers.",
      volgorde:
        "Wordt meestal als complete eenheid — met differentieel en trailing arms er al aan — onder de auto gehesen en met de vier subframerubbers vastgezet, vóórdat de rest wordt aangesloten.",
      fouten:
        "De subframerubbers verwaarlozen: bij intensief driften slijten of scheuren deze sneller dan bij normaal gebruik, wat resulteert in een merkbaar minder voorspelbare achterkant. Veel drift-builds vervangen ze daarom door polyurethaan rubbers. Verkeerd aandraaimoment op de subframebouten is een andere veelgemaakte fout.",
    },
  });

  const trailingPivot = [0.75, -0.42, 0.5];
  const hubPivot = [0, -0.25, -0.05];
  defs.push({
    id: "draagarm",
    name: "Draagarm (trailing arm)",
    order: 2,
    color: 0x5a6472,
    mesh: makeLink(trailingPivot, hubPivot, 0.045, 0x5a6472),
    explodeOffset: [0.3, -0.85, 0.1],
    info: {
      functie:
        "Geleidt de op- en neerbeweging van het achterwiel. Doordat de draaias van de arm schuin (semi-trailing) staat, veranderen camber én spoor (toe) tijdens het inveren — dit gedrag is mede bepalend voor hoe voorspelbaar de auto oversteert tijdens een drift.",
      volgorde:
        "Wordt op de achterasdraagbalk gemonteerd via een groot rubber/kogellager (de trailing arm bushing), vóórdat naaf en demper worden aangesloten.",
      fouten:
        "Het trailing arm-lager met speling laten zitten geeft merkbare 'wheel hop' bij hard optrekken of tijdens een drift. Links en rechts verwisselen is ook een klassieke fout, omdat de arm asymmetrisch is.",
    },
  });

  const hubPoint = [0, 0, 0];
  defs.push({
    id: "wiellager",
    name: "Wiellager & naaf",
    order: 3,
    color: 0x6e7889,
    mesh: makeCylinder(hubPoint, 0.09, 0.17, 0x6e7889, { axis: "x", metalness: 0.7, roughness: 0.25 }),
    explodeOffset: [-0.7, 0.1, 0.15],
    info: {
      functie:
        "Laat het achterwiel vrij draaien en draagt de remschijf. Bij de E36 komt hier ook de aandrijfas op aan, in tegenstelling tot een niet-aangedreven achteras.",
      volgorde:
        "Wordt in/aan de trailing arm gemonteerd, waarna de aandrijfas erop aangesloten kan worden.",
      fouten:
        "De naafmoer aandraaien zonder het wiel of de as tegen te houden, waardoor het aandraaimoment niet klopt. Een lager met speling hergebruiken in plaats van vervangen.",
    },
  });

  const shockBottom = [0.02, -0.15, -0.12];
  const shockTop = [0.08, 0.75, -0.18];
  defs.push({
    id: "schokdemper",
    name: "Schokdemper",
    order: 4,
    color: 0x8a94a3,
    mesh: makeLink(shockBottom, shockTop, 0.048, 0x8a94a3, { metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [-0.2, 0.85, 0.4],
    info: {
      functie:
        "Dempt de veerbeweging van de achteras. Goed afgestemde achterdempers zijn cruciaal voor tractie bij het optrekken uit een bocht of het vasthouden van een drift.",
      volgorde:
        "Onderaan op de trailing arm bevestigd, bovenaan aan de carrosserie — bij de E36 zitten veer en demper achterin, anders dan voorin, niet als één samengedrukte eenheid.",
      fouten:
        "Een demper kiezen die niet is afgestemd op de (vaak stijvere) veer van een drift-setup. Bevestigingsbouten niet op het juiste moment aandraaien.",
    },
  });

  defs.push({
    id: "veer",
    name: "Veer",
    order: 5,
    color: 0x3ba76b,
    mesh: makeCoilSpring([0.35, 0.15, 0.15], 0.11, 0.013, 0.42, 5, 0x3ba76b),
    explodeOffset: [0.55, 0.5, 0.5],
    info: {
      functie:
        "Draagt het gewicht van de achterkant van de auto en het differentieel. De veerstijfheid en -hoogte bepalen mede de gewichtsverdeling en het oversteergedrag in bochten.",
      volgorde:
        "Los van de demper gemonteerd tussen een onderste en bovenste veerschotel, nadat de trailing arm al vastzit.",
      fouten:
        "Een verlaagde veer monteren zonder de eindslag (bump stops) te controleren — geeft doorslaan of klapgeluiden bij zware belasting in bochten, precies wanneer je het minst wil.",
    },
  });

  defs.push({
    id: "veerschotel",
    name: "Veerschotel / top mount",
    order: 6,
    color: 0x2f3644,
    mesh: makeCylinder([shockTop[0], shockTop[1] + 0.02, shockTop[2]], 0.085, 0.05, 0x2f3644, { axis: "x" }),
    explodeOffset: [0.15, 0.7, -0.3],
    info: {
      functie:
        "Bevestigt de bovenkant van de schokdemper aan de carrosserie en isoleert trillingen van de weg richting het interieur.",
      volgorde:
        "Sluit de dempermontage af: geplaatst en vastgezet nadat de demper in positie hangt.",
      fouten:
        "Een hard geworden of gescheurd rubber top mount hergebruiken — geeft extra geluid en merkbaar minder controle over de achteras.",
    },
  });

  const diffOutput = [0.95, -0.05, 0.05];
  const driveshaftGroup = new THREE.Group();
  driveshaftGroup.add(makeLink(diffOutput, hubPoint, 0.032, 0xb5bdc9, { metalness: 0.6, roughness: 0.3 }));
  driveshaftGroup.add(makeSphere(diffOutput, 0.06, 0x8a94a3, { metalness: 0.6 }));
  driveshaftGroup.add(makeSphere(hubPoint, 0.06, 0x8a94a3, { metalness: 0.6 }));
  defs.push({
    id: "aandrijfas",
    name: "Aandrijfas",
    order: 7,
    color: 0xb5bdc9,
    mesh: driveshaftGroup,
    explodeOffset: [0.4, -0.5, -0.7],
    info: {
      functie:
        "Brengt het motorvermogen van het differentieel naar het achterwiel, met flexibele koppelingen aan beide uiteinden om de op- en neerbeweging van de ophanging op te vangen.",
      volgorde:
        "Wordt aangesloten nadat zowel het differentieel als het wiellager op hun plek zitten.",
      fouten:
        "De as met te veel hoek laten monteren (bijvoorbeeld door een sterk verlaagde drift-setup zonder aangepaste geometrie), wat trilling bij hoge snelheid en versnelde slijtage van de koppelingen geeft.",
    },
  });

  defs.push({
    id: "remschijf",
    name: "Remschijf (met handremtrommel)",
    order: 8,
    color: 0x707070,
    mesh: makeCylinder([0.05, 0, 0], 0.26, 0.026, 0x707070, { axis: "x", metalness: 0.55, roughness: 0.5, segments: 32 }),
    explodeOffset: [-0.45, 0, 0],
    info: {
      functie:
        "Samen met de klauw verantwoordelijk voor het afremmen van de achterwielen. Bij de E36 zit in de naaf van de achterschijf een kleine trommel, waarin aparte handremschoenen werken.",
      volgorde:
        "Over de naaf geschoven nadat het wiellager gemonteerd is, vóórdat de remklauw erover geplaatst wordt.",
      fouten:
        "Vergeten de handremschoenen in de ingebouwde trommel bij te stellen na het vervangen van de schijf, waardoor de handrem nauwelijks nog pakt.",
    },
  });

  defs.push({
    id: "remklauw",
    name: "Remklauw",
    order: 9,
    color: 0xc73b3b,
    mesh: makeBox([0.055, 0.2, 0.02], [0.12, 0.17, 0.24], 0xc73b3b),
    explodeOffset: [0, 0.15, 0.7],
    info: {
      functie:
        "Knijpt de remblokken tegen de achterschijf. Levert normaliter minder remkracht dan de voorklauw, omdat het meeste remwerk voorin gebeurt.",
      volgorde:
        "Na de schijf gemonteerd; de remleiding wordt aangesloten en het systeem ontlucht.",
      fouten:
        "Remklauwbouten niet op het juiste moment aandraaien. Ontluchten vergeten na montage, waardoor het rempedaal 'sponzig' aanvoelt.",
    },
  });

  defs.push({
    id: "handremkabel",
    name: "Handremkabel",
    order: 10,
    color: 0x394452,
    mesh: makeLink([0.08, 0.12, 0.15], [0.7, -0.35, 0.45], 0.014, 0x394452),
    explodeOffset: [0.3, -0.2, 0.7],
    info: {
      functie:
        "Bedient mechanisch de handremschoenen in de achterschijf, onafhankelijk van het hydraulische remsysteem. Bij driften essentieel om de achterkant los te trekken (de klassieke 'handremstart' of 'kick').",
      volgorde:
        "Aangesloten nadat de remklauw en schijf gemonteerd zijn, als een van de laatste stappen.",
      fouten:
        "De kabel te strak afstellen (de rem sleept continu een beetje mee, wat oververhitting geeft) of te los (de handrem grijpt nauwelijks). Bij intensief drift-gebruik slijt een verkeerd afgestelde handrem opvallend snel.",
    },
  });

  defs.push({
    id: "wiel",
    name: "Wiel (velg + band)",
    order: 11,
    color: 0x20242c,
    mesh: (() => {
      const group = new THREE.Group();
      const tire = makeCylinder([0, 0, 0], 0.34, 0.24, 0x20242c, {
        axis: "x",
        metalness: 0.1,
        roughness: 0.9,
        transparent: true,
        opacity: 0.55,
      });
      const rim = makeCylinder([0, 0, 0], 0.19, 0.24, 0x9aa4b5, {
        axis: "x",
        metalness: 0.8,
        roughness: 0.3,
        transparent: true,
        opacity: 0.55,
      });
      group.add(tire, rim);
      return group;
    })(),
    explodeOffset: [-1.3, 0, 0],
    info: {
      functie:
        "Het wiel is het contactpunt met de weg — bij de achteras ook het punt waar de motorkracht uiteindelijk wordt overgebracht. Hier getoond voor context.",
      volgorde:
        "In de praktijk als eerste gedemonteerd en als laatste weer gemonteerd.",
      fouten:
        "Wielmoeren niet kruislings en niet op het juiste aandraaimoment vastzetten.",
    },
  });

  return defs;
}
