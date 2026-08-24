// Schematische geometrie + kennisdata voor het complete remcircuit van een BMW E36
// (pedaal -> bekrachtiger -> hoofdremcilinder -> ABS -> leidingen -> wielen + handrem).
//
// Coordinatensysteem (meters, bij benadering):
//   x = 0 hart van de auto -> x>0 naar rechts/buiten
//   y = 0 vloerhoogte cabine -> y>0 omhoog
//   z = 0 firewall -> z>0 het interieur in (naar de bestuurder), z<0 naar voren/onder de auto

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "remsysteem",
  name: "Remsysteem",
  short: "Remmen",
  description:
    "Het complete (diagonaal gesplitste) remcircuit: pedaal, bekrachtiger, hoofdremcilinder, ABS-blok, leidingen, en de rem- en handremwerking op de wielen.",
  cameraPosition: [2.6, 1.7, 2.6],
  cameraTarget: [0.5, 0.15, 0.1],
};

export function createParts() {
  const defs = [];

  const pedalPivot = [0.3, 0.4, 0.95];
  const pedalPad = [0.3, -0.05, 1.15];
  defs.push({
    id: "rempedaal",
    name: "Rempedaal",
    order: 1,
    color: 0x394452,
    mesh: makeLink(pedalPivot, pedalPad, 0.022, 0x394452),
    explodeOffset: [-0.4, 0, 0.6],
    info: {
      functie:
        "Het startpunt van het remcircuit: de trapkracht van de bestuurder wordt via een drukstang doorgegeven aan de rembekrachtiger en hoofdremcilinder.",
      volgorde:
        "Zit vast aan het pedaalstel achter de bekrachtiger; wordt gemonteerd vóórdat de rest van het hydraulische circuit wordt aangesloten.",
      fouten:
        "Speling in het pedaalmechanisme (drukstang-afstelling) verkeerd instellen, waardoor het rempedaal te veel of te weinig vrije slag heeft voordat de rem echt begint te pakken.",
    },
  });

  const boosterCenter = [0.3, 0.35, 0.78];
  defs.push({
    id: "rembekrachtiger",
    name: "Rembekrachtiger",
    order: 2,
    color: 0x6e7889,
    mesh: makeCylinder(boosterCenter, 0.13, 0.2, 0x6e7889, { axis: "z", metalness: 0.4, roughness: 0.5 }),
    explodeOffset: [0, 0.15, 0.9],
    info: {
      functie:
        "Versterkt de trapkracht op het rempedaal met behulp van onderdruk uit het inlaatsysteem van de motor, zodat er geen bovenmenselijke kracht nodig is om hard te remmen.",
      volgorde:
        "Gemonteerd op de firewall, tussen het rempedaal en de hoofdremcilinder, vóórdat de hoofdremcilinder erop geplaatst wordt.",
      fouten:
        "Een lekkende onderdrukslang naar de bekrachtiger over het hoofd zien — de rem blijft dan werken, maar voelt opeens zwaar aan, wat verwarrend en gevaarlijk kan zijn tijdens het rijden.",
    },
  });

  const masterCylCenter = [0.3, 0.35, 0.6];
  defs.push({
    id: "hoofdremcilinder",
    name: "Hoofdremcilinder",
    order: 3,
    color: 0x4a5568,
    mesh: makeCylinder(masterCylCenter, 0.055, 0.22, 0x4a5568, { axis: "z", metalness: 0.5, roughness: 0.45 }),
    explodeOffset: [0, 0.2, 0.6],
    info: {
      functie:
        "Zet de mechanische trapkracht om in hydraulische druk. De E36 heeft — zoals vrijwel alle moderne auto's — een tandem-hoofdremcilinder met twee gescheiden drukkamers voor twee onafhankelijke circuits (diagonaal gesplitst: linksvoor+rechtsachter en rechtsvoor+linksachter), zodat bij een lek op één circuit de andere twee wielen nog steeds remmen.",
      volgorde:
        "Wordt vóór de bekrachtiger op de firewall gemonteerd, waarna het reservoir erop en de leidingen eraan komen.",
      fouten:
        "Het circuit niet correct ontluchten na vervanging, waardoor er lucht in de leidingen blijft zitten en het pedaal 'sponzig' aanvoelt. Verkeerde volgorde van ontluchten (moet meestal beginnen bij het wiel dat het verst van de hoofdremcilinder af zit).",
    },
  });

  defs.push({
    id: "remvloeistofreservoir",
    name: "Remvloeistofreservoir",
    order: 4,
    color: 0xd6dae2,
    mesh: makeBox([0.3, 0.48, 0.58], [0.12, 0.12, 0.18], 0xd6dae2, { transparent: true, opacity: 0.65, roughness: 0.2 }),
    explodeOffset: [0, 0.55, 0],
    info: {
      functie:
        "Voorraadvat voor de remvloeistof (DOT 4) die de hoofdremcilinder van vloeistof voorziet en volume-verschillen (bijvoorbeeld door slijtage van de remblokken) opvangt.",
      volgorde:
        "Wordt op de hoofdremcilinder geklikt/gemonteerd nadat deze op zijn plek zit.",
      fouten:
        "Remvloeistof niet op tijd verversen — DOT 4 is hygroscopisch (trekt vocht aan uit de lucht), waardoor het kookpunt daalt. Bij intensief en herhaald hard remmen (zoals tijdens trackdays of driftsessies) kan de vloeistof dan gaan koken, met een wegvallend rempedaal tot gevolg.",
    },
  });

  const absCenter = [0.65, 0.15, 0.55];
  defs.push({
    id: "abs-blok",
    name: "ABS-hydrauliekblok",
    order: 5,
    color: 0x2f3644,
    mesh: makeBox(absCenter, [0.22, 0.16, 0.2], 0x2f3644),
    explodeOffset: [0.6, -0.1, 0.3],
    info: {
      functie:
        "Regelt per wiel de remdruk om blokkeren te voorkomen (ABS) door de druk razendsnel te pulseren via kleppen en een pomp. Bevindt zich tussen de hoofdremcilinder en de vier wielcircuits in.",
      volgorde:
        "Wordt tussen de hoofdremcilinder en de remleidingen naar de wielen gemonteerd; de leidingen worden er als laatste op aangesloten.",
      fouten:
        "Bij het loskoppelen van leidingen vuil in het ABS-blok laten komen — de kleine interne kanaaltjes en kleppen zijn hier zeer gevoelig voor en kunnen daardoor vast gaan zitten.",
    },
  });

  const frontCornerPoint = [1.1, -0.25, 0.15];
  const rearCornerPoint = [1.1, -0.3, -0.85];

  defs.push({
    id: "remleiding-voor",
    name: "Remleiding (voorcircuit)",
    order: 6,
    color: 0xb5bdc9,
    mesh: makeCurvedTube(
      [[masterCylCenter[0] + 0.06, masterCylCenter[1], masterCylCenter[2] - 0.11], absCenter, [0.95, -0.1, 0.35], frontCornerPoint],
      0.012,
      0xb5bdc9,
      { metalness: 0.6, roughness: 0.3 }
    ),
    explodeOffset: [0.3, 0.1, 0.6],
    info: {
      functie:
        "Voert de hydraulische remdruk van het ABS-blok naar de remklauw van (bij een diagonaal circuit) één voor- en één achterwiel tegelijk.",
      volgorde:
        "Aangesloten nadat hoofdremcilinder en ABS-blok gemonteerd zijn; wordt als laatste stap van het circuit ontlucht.",
      fouten:
        "Stalen remleidingen buigen met een te kleine radius, waardoor ze afknikken en de doorstroming beperken. Een leiding laten schuren tegen de carrosserie of ophangingsonderdelen, wat op termijn een lek veroorzaakt.",
    },
  });

  defs.push({
    id: "remleiding-achter",
    name: "Remleiding (achtercircuit)",
    order: 7,
    color: 0xb5bdc9,
    mesh: makeCurvedTube(
      [[masterCylCenter[0] - 0.06, masterCylCenter[1], masterCylCenter[2] - 0.11], absCenter, [1.0, -0.15, -0.4], rearCornerPoint],
      0.012,
      0xb5bdc9,
      { metalness: 0.6, roughness: 0.3 }
    ),
    explodeOffset: [0.3, 0.1, -0.6],
    info: {
      functie:
        "Voert de hydraulische remdruk van het ABS-blok naar de remklauw van het overeenkomstige achterwiel in het diagonale circuit.",
      volgorde:
        "Net als de voorleiding aangesloten na het ABS-blok, en als onderdeel van hetzelfde diagonale circuit ontlucht.",
      fouten:
        "Bij een drift-build de flexibele rembslangen bij de achteras vergeten te controleren op voldoende lengte/vrijheid als de ophanging sterk verlaagd of anders geometrisch is opgebouwd — te strak gespannen slangen kunnen scheuren bij volle inveerslag.",
    },
  });

  const frontBrakeGroup = new THREE.Group();
  frontBrakeGroup.add(makeCylinder([frontCornerPoint[0] - 0.05, frontCornerPoint[1], frontCornerPoint[2]], 0.27, 0.026, 0x707070, { axis: "x", metalness: 0.55, roughness: 0.5, segments: 28 }));
  frontBrakeGroup.add(makeBox([frontCornerPoint[0], frontCornerPoint[1] + 0.02, frontCornerPoint[2] + 0.03], [0.13, 0.18, 0.24], 0xc73b3b));
  defs.push({
    id: "voorrem",
    name: "Voorrem (schijf + remklauw)",
    order: 8,
    color: 0xc73b3b,
    mesh: frontBrakeGroup,
    explodeOffset: [0.6, 0, 0.4],
    info: {
      functie:
        "Levert het grootste deel van de remkracht: bij het remmen verplaatst het gewicht van de auto zich naar voren, waardoor de voorwielen meer grip en dus meer remcapaciteit nodig hebben. Grotere schijven en meerzuiger-remklauwen zijn daarom een populaire upgrade bij een drift-build.",
      volgorde:
        "Wordt gemonteerd nadat de remleiding is aangelegd; na montage wordt dit circuit als eerste (of samen met het achtercircuit) ontlucht.",
      fouten:
        "Een grotere remschijf/klauw monteren zonder te checken of het wiel (velg) er nog overheen past — een klassieke valkuil bij het upgraden van remmen op een gedriften E36.",
    },
  });

  const rearBrakeGroup = new THREE.Group();
  rearBrakeGroup.add(makeCylinder([rearCornerPoint[0] - 0.05, rearCornerPoint[1], rearCornerPoint[2]], 0.24, 0.024, 0x707070, { axis: "x", metalness: 0.55, roughness: 0.5, segments: 28 }));
  rearBrakeGroup.add(makeBox([rearCornerPoint[0], rearCornerPoint[1] + 0.02, rearCornerPoint[2] + 0.03], [0.11, 0.15, 0.2], 0xc73b3b));
  defs.push({
    id: "achterrem",
    name: "Achterrem (schijf + remklauw)",
    order: 9,
    color: 0xc73b3b,
    mesh: rearBrakeGroup,
    explodeOffset: [0.6, 0, -0.4],
    info: {
      functie:
        "Levert een kleiner deel van de remkracht dan de voorrem, maar is minstens zo belangrijk bij driften: de balans tussen voor- en achterremkracht (en de handrem, zie hieronder) bepaalt mede hoe voorspelbaar de achterkant losbreekt.",
      volgorde:
        "Net als de voorrem gemonteerd na het aanleggen van de remleiding, en meegenomen in dezelfde ontluchtingsbeurt.",
      fouten:
        "De achterremdruk (via de remkrachtverdeler/het ABS-systeem) niet laten meewegen bij het kiezen van een agressievere voor-opstelling — een sterk overheersende voorrem maakt de auto 'saai' en minder makkelijk om los te laten breken.",
    },
  });

  defs.push({
    id: "handremhendel",
    name: "Handremhendel",
    order: 10,
    color: 0x394452,
    mesh: makeLink([0.05, 0.3, 0.85], [0.05, 0.58, 0.98], 0.022, 0x394452),
    explodeOffset: [-0.5, 0.2, 0.4],
    info: {
      functie:
        "Bedient mechanisch (dus los van het hydraulische systeem) de handremschoenen in de achterwielen. Bij driften veelgebruikt om de achterkant actief te laten losbreken (de 'handremstart' of 'kick').",
      volgorde:
        "Gemonteerd in het middenconsole-gebied, met de kabels naar achteren gerouteerd nadat de achterremmen al op hun plek zitten.",
      fouten:
        "Bij drift-gebruik de handrem als 'gewone' rem behandelen tijdens normaal rijden — de handrem is niet ontworpen voor herhaald hard/hydraulisch remmen en slijt en verhit dan sneller dan verwacht.",
    },
  });

  defs.push({
    id: "handremkabels",
    name: "Handremkabels",
    order: 11,
    color: 0x2f3644,
    mesh: makeCurvedTube([[0.05, 0.32, 0.85], [0.4, -0.1, 0.2], [0.8, -0.25, -0.6], rearCornerPoint], 0.012, 0x2f3644),
    explodeOffset: [0.4, -0.3, -0.5],
    info: {
      functie:
        "Brengen de trekkracht van de handremhendel over naar de handremschoenen in de achterschijven, via een verdeelstuk (equalizer) dat de kracht gelijk over beide achterwielen verdeelt.",
      volgorde:
        "Als laatste van het remcircuit aangesloten en afgesteld, nadat alle andere onderdelen al gemonteerd zijn.",
      fouten:
        "De kabels ongelijk afstellen, waardoor de handrem asymmetrisch pakt — voor een voorspelbare handremstart bij het driften is een gelijke, goed afgestelde trekkracht aan beide kanten juist extra belangrijk.",
    },
  });

  return defs;
}
