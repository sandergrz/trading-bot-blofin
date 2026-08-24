// Schematische geometrie + kennisdata voor een BMW E36-motor op blokniveau
// (generiek voor de gangbare E36-motoren: M40/M42/M44 viercilinder,
// M50/M52/S50 zescilinder, en populaire swaps zoals de S54).
//
// Coordinatensysteem (meters): x=0 hart van de motor, y=0 onderkant blok,
// z>0 voorkant motor (poelie-/radiateurzijde), z<0 vliegwielzijde (richting bak).

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "motor",
  name: "Motor",
  short: "Motor",
  description:
    "De motor op blokniveau: van krukas en zuigers tot cilinderkop, distributie en hulpstukken — generiek voor de gangbare E36 vier- en zescilinders.",
  cameraPosition: [2.9, 1.7, 2.6],
  cameraTarget: [0, 0.15, 0],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "motorblok",
    name: "Motorblok",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox([0, 0.05, 0], [0.5, 0.5, 0.85], 0x4a5568),
    explodeOffset: [0, -1.1, 0],
    info: {
      functie:
        "Het blok huisvest de cilinders, de krukas en het grootste deel van het smeersysteem — de basis waarop alle andere motoronderdelen gebouwd worden. De E36 kwam standaard met viercilinder- (M40/M42/M44) of zescilindermotoren (M50/M52/S50).",
      volgorde:
        "Wordt als eerste op de motorsteunen in de motorruimte geplaatst, vóórdat kop, kleppendeksel en hulpstukken worden gemonteerd.",
      fouten:
        "Bij een motorswap — in de E36 drift-scene erg populair, denk aan een S54 uit de E46 M3, of zelfs 2JZ/LS-swaps — de motorsteunen en het extra motorgewicht niet goed doorrekenen. Een te zwaar of verkeerd gepositioneerd blok verstoort de gewichtsverdeling en daarmee het drift-gedrag van de auto.",
    },
  });

  const crankCenter = [0, -0.07, 0];
  defs.push({
    id: "krukas",
    name: "Krukas",
    order: 2,
    color: 0x8a94a3,
    mesh: makeCylinder(crankCenter, 0.045, 0.78, 0x8a94a3, { axis: "z", metalness: 0.7, roughness: 0.25 }),
    explodeOffset: [0, -0.5, 0],
    info: {
      functie:
        "Zet de op-en-neergaande beweging van de zuigers om in een draaiende beweging, die uiteindelijk via koppeling, versnellingsbak en differentieel de achterwielen aandrijft.",
      volgorde:
        "Als eerste bewegende onderdeel in het kale blok gelegerd, vóórdat zuigers en drijfstangen gemonteerd worden.",
      fouten:
        "De hoofdlagers (main bearings) met verkeerde speling monteren, of de aandraaivolgorde en het aandraaimoment van de hoofdlagerkappen niet aanhouden — leidt tot vroegtijdige lagerschade, extra funest bij een motor die regelmatig hoge toerentallen en belasting te verduren krijgt tijdens het driften.",
    },
  });

  const pistonGroup = new THREE.Group();
  const cylinderCount = 6;
  for (let i = 0; i < cylinderCount; i++) {
    const z = -0.32 + (i * 0.64) / (cylinderCount - 1);
    pistonGroup.add(makeCylinder([0, 0.16, z], 0.045, 0.09, 0x9aa4b5, { metalness: 0.6, roughness: 0.3 }));
    pistonGroup.add(makeLink([0, 0.12, z], [crankCenter[0], crankCenter[1], z], 0.014, 0x707070));
  }
  defs.push({
    id: "zuigers",
    name: "Zuigers & drijfstangen",
    order: 3,
    color: 0x9aa4b5,
    mesh: pistonGroup,
    explodeOffset: [0, 0.7, 0],
    info: {
      functie:
        "Zetten de verbrandingsdruk om in een kracht op de krukas: de zuigers bewegen op en neer in de cilinders, de drijfstangen verbinden ze met de krukas.",
      volgorde:
        "Gemonteerd nadat de krukas in het blok ligt, vóórdat de cilinderkop erop geplaatst wordt.",
      fouten:
        "Zuigerveren (ringen) verkeerd om monteren, of drijfstangen bij een revisie niet in de juiste cilinder en oriëntatie terugplaatsen — beide geven verhoogd olieverbruik of directe motorschade.",
    },
  });

  defs.push({
    id: "cilinderkop",
    name: "Cilinderkop",
    order: 4,
    color: 0x5a6472,
    mesh: makeBox([0, 0.34, 0], [0.46, 0.2, 0.82], 0x5a6472),
    explodeOffset: [0, 0.9, 0],
    info: {
      functie:
        "Sluit de cilinders af en huisvest de kleppen, de nokkenas(sen) en — bij de meeste E36-motoren — de VANOS-eenheid die de klepafstelling regelt.",
      volgorde:
        "Op het blok gemonteerd nadat zuigers en drijfstangen erin zitten, met een nieuwe koppakking ertussen.",
      fouten:
        "De kopbouten niet in de voorgeschreven volgorde en in meerdere stappen tot het einddraaimoment aandraaien — geeft een ongelijkmatig afgedichte koppakking en verhoogt de kans op lekkage of een doorgeslagen pakking.",
    },
  });

  defs.push({
    id: "kleppendeksel",
    name: "Kleppendeksel",
    order: 5,
    color: 0x20242c,
    mesh: makeBox([0, 0.48, 0], [0.42, 0.08, 0.78], 0x20242c),
    explodeOffset: [0, 0.7, -0.6],
    info: {
      functie:
        "Sluit de bovenkant van de cilinderkop af en houdt de olie bij de kleppen en nokkenas binnen de motor.",
      volgorde:
        "Als een van de laatste stappen bovenop de gemonteerde cilinderkop geplaatst.",
      fouten:
        "De kleppendekselpakking te vast aandraaien — kan de dunne pakking of het deksel zelf vervormen, een klassieke oorzaak van hardnekkige olielekkages bij BMW-motoren.",
    },
  });

  const crankGear = [0, -0.07, 0.42];
  const camGear = [0, 0.32, 0.42];
  const timingGroup = new THREE.Group();
  timingGroup.add(makeCylinder(crankGear, 0.06, 0.03, 0x2f3644, { axis: "z" }));
  timingGroup.add(makeCylinder(camGear, 0.07, 0.03, 0x2f3644, { axis: "z" }));
  timingGroup.add(makeLink([crankGear[0] - 0.06, crankGear[1], crankGear[2]], [camGear[0] - 0.07, camGear[1], camGear[2]], 0.008, 0x707070));
  timingGroup.add(makeLink([crankGear[0] + 0.06, crankGear[1], crankGear[2]], [camGear[0] + 0.07, camGear[1], camGear[2]], 0.008, 0x707070));
  defs.push({
    id: "distributie",
    name: "Distributieketting/-riem",
    order: 6,
    color: 0x2f3644,
    mesh: timingGroup,
    explodeOffset: [0, 0.2, 0.9],
    info: {
      functie:
        "Houdt de rotatie van de krukas en de nokkenas(sen) — en daarmee de klepbediening — synchroon met de zuigerbeweging. De M50/M52/S50/S54-motoren gebruiken een ketting, de oudere M40/M42 een riem.",
      volgorde:
        "Gemonteerd nadat kop en blok met elkaar verbonden zijn, met de kruk- en nokkenastandwielen exact op hun merktekens uitgelijnd.",
      fouten:
        "De kleppen en zuigers niet correct 'op hun merktekens' (op tijd) zetten bij montage. Vrijwel alle E36-motoren zijn 'interference engines' — de kleppen kunnen de zuigers raken als de timing verkeerd staat, wat direct zware motorschade geeft bij het starten.",
    },
  });

  const waterPumpCenter = [0, -0.02, 0.5];
  defs.push({
    id: "waterpomp",
    name: "Waterpomp",
    order: 7,
    color: 0x6e7889,
    mesh: makeCylinder(waterPumpCenter, 0.075, 0.09, 0x6e7889, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, 0, 0.4],
    info: {
      functie:
        "Pompt koelvloeistof door blok, cilinderkop en radiateur om de motor op bedrijfstemperatuur te houden.",
      volgorde:
        "Aan de voorkant van het blok gemonteerd, vaak aangedreven door dezelfde ketting/riem als de nokkenas.",
      fouten:
        "Een waterpomp met een lekkende as-afdichting laten zitten 'omdat hij nog niet echt lekt' — de inwendige lagers kunnen zonder duidelijke waarschuwing verslijten, tot de pomp plotseling vastloopt en de distributie beschadigt.",
    },
  });

  const pulleyCenter = [0, -0.07, 0.58];
  const pulleyGroup = new THREE.Group();
  pulleyGroup.add(makeCylinder(pulleyCenter, 0.1, 0.05, 0x394452, { axis: "z", metalness: 0.6 }));
  defs.push({
    id: "krukaspoelie",
    name: "Krukaspoelie + accessoireriem",
    order: 8,
    color: 0x394452,
    mesh: pulleyGroup,
    explodeOffset: [0, -0.3, 0.9],
    info: {
      functie:
        "Drijft via een riem de hulpstukken aan vanaf de krukas: alternator, stuurbekrachtigingspomp en eventueel de airco-compressor.",
      volgorde:
        "Aan de voorkant van de krukas gemonteerd nadat de distributie is afgesteld.",
      fouten:
        "De poelie-bout niet op het (zeer hoge) voorgeschreven aandraaimoment vastzetten — deze bout staat onder grote belasting en kan bij te losse montage de spie (keyway) beschadigen.",
    },
  });

  const alternatorCenter = [0.24, 0.08, 0.48];
  defs.push({
    id: "alternator",
    name: "Alternator",
    order: 9,
    color: 0x707070,
    mesh: makeCylinder(alternatorCenter, 0.065, 0.11, 0x707070, { axis: "z", metalness: 0.55, roughness: 0.4 }),
    explodeOffset: [0.6, 0.2, 0.3],
    info: {
      functie:
        "Wekt elektriciteit op om de accu te laden en het elektrische systeem van stroom te voorzien, aangedreven door de accessoireriem.",
      volgorde:
        "Gemonteerd en aangedreven nadat de krukaspoelie en riem geplaatst zijn; de riemspanning is de laatste afstelstap.",
      fouten:
        "De riemspanning verkeerd instellen: te los geeft piepen en onvoldoende laadstroom (merkbaar bij extra elektrische verbruikers in een build), te strak overbelast het alternatorlager.",
    },
  });

  defs.push({
    id: "inlaatspruitstuk",
    name: "Inlaatspruitstuk",
    order: 10,
    color: 0xb5bdc9,
    mesh: makeBox([-0.34, 0.3, 0], [0.14, 0.14, 0.65], 0xb5bdc9, { metalness: 0.4, roughness: 0.4 }),
    explodeOffset: [-0.8, 0.1, 0],
    info: {
      functie:
        "Verdeelt de aangezogen lucht gelijkmatig over de cilinders, vlak vóór de injectoren of inlaatkleppen.",
      volgorde:
        "Op de cilinderkop gemonteerd nadat deze zelf op het blok zit.",
      fouten:
        "Inlaatpakkingen en -rubbers niet goed laten aansluiten — een klein valse-luchtlek hier verstoort de luchtmengselberekening van de motorcomputer merkbaar, met een onrustig stationair toerental als gevolg.",
    },
  });

  defs.push({
    id: "uitlaatspruitstuk",
    name: "Uitlaatspruitstuk",
    order: 11,
    color: 0x707070,
    mesh: makeCurvedTube(
      [
        [0.34, 0.25, -0.3],
        [0.42, 0.15, -0.05],
        [0.4, 0.05, 0.2],
        [0.3, -0.02, 0.35],
      ],
      0.035,
      0x707070,
      { metalness: 0.6, roughness: 0.4 }
    ),
    explodeOffset: [0.8, -0.2, 0.3],
    info: {
      functie:
        "Voert de verbrande gassen van de cilinders samen naar het uitlaatsysteem. De vorm en lengte van de runners beïnvloedt merkbaar het koppel- en vermogenskarakter van de motor.",
      volgorde:
        "Op de cilinderkop gemonteerd, meestal aan de tegenoverliggende kant van het inlaatspruitstuk.",
      fouten:
        "Uitlaatbouten of -moeren op een nog warme motor los- of vastdraaien zonder te laten afkoelen — verhoogt sterk het risico op afgebroken, vastgeroeste bevestigingen.",
    },
  });

  defs.push({
    id: "motorsteunen",
    name: "Motorsteunen",
    order: 12,
    color: 0x2f3644,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeLink([-0.28, -0.2, -0.1], [-0.5, -0.55, -0.1], 0.035, 0x2f3644));
      group.add(makeLink([0.28, -0.2, -0.1], [0.5, -0.55, -0.1], 0.035, 0x2f3644));
      return group;
    })(),
    explodeOffset: [0, -0.9, -0.4],
    info: {
      functie:
        "Dragen het gewicht van de motor en isoleren trillingen richting de carrosserie, terwijl ze de motor stevig op zijn plek houden — ook onder het hoge, wisselende koppel van driften.",
      volgorde:
        "Als eerste gemonteerd (op blok en carrosserie/subframe), vóórdat de motor definitief op zijn plek hangt.",
      fouten:
        "Verharde of gescheurde rubberen motorsteunen laten zitten. Dat geeft extra motorbeweging onder belasting, wat bij een drift-build met veel koppelwisselingen (clutch kicks, gasstoten) versneld tot kabel- of leidingbreuk, of zelfs uitlijnproblemen met de versnellingsbak kan leiden.",
    },
  });

  return defs;
}
