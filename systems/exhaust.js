// Schematische geometrie + kennisdata voor het uitlaatsysteem van een BMW E36.
// Coordinatensysteem (meters): z>0 voorkant (motor), z<0 achterkant van de auto.

import * as THREE from "three";
import { makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "uitlaatsysteem",
  name: "Uitlaatsysteem",
  short: "Uitlaat",
  description:
    "Van downpipe tot einddemper: katalysator, lambdasonde, resonator en de afwegingen rond cat-delete en straight-piping.",
  cameraPosition: [2.4, 1.3, 2.9],
  cameraTarget: [0, -0.05, -0.1],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "voorpijp",
    name: "Voorpijp (downpipe)",
    order: 1,
    color: 0x707070,
    mesh: makeCurvedTube([[0, 0, 0.85], [0, -0.03, 0.7], [0, -0.05, 0.55]], 0.035, 0x707070, { metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, 0.3, 0.3],
    info: {
      functie:
        "Voert de hete uitlaatgassen van het spruitstuk naar de rest van het systeem. De diameter en vorm hier hebben relatief veel invloed op zowel het uitlaatgeluid als de tegendruk.",
      volgorde:
        "Direct op het uitlaatspruitstuk gemonteerd, als eerste stap van het uitlaatsysteem.",
      fouten:
        "Een te wijde downpipe monteren zonder de rest van het systeem mee te nemen — de uitlaatgasstroom verliest dan snelheid bij lage toerentallen, wat merkbaar koppelverlies onderin geeft.",
    },
  });

  defs.push({
    id: "lambdasonde",
    name: "Lambdasonde",
    order: 2,
    color: 0x2f3644,
    mesh: makeCylinder([0.05, -0.02, 0.6], 0.012, 0.06, 0x2f3644, { axis: "y", metalness: 0.4 }),
    explodeOffset: [0.4, 0.4, 0],
    info: {
      functie:
        "Meet het zuurstofgehalte in de uitlaatgassen en geeft dit terug aan de motorcomputer, die daarmee het brandstofmengsel bijstelt voor een optimale verbranding.",
      volgorde:
        "Vlak vóór de katalysator in de voorpijp geschroefd, met de elektrische aansluiting als laatste stap.",
      fouten:
        "De sensor met vet of afdichtingspasta op het schroefdraad besmeuren — de sensortip moet schoon en onbeschadigd blijven, anders geeft hij verkeerde metingen door aan de motorcomputer.",
    },
  });

  defs.push({
    id: "katalysator",
    name: "Katalysator",
    order: 3,
    color: 0x5a6472,
    mesh: makeCylinder([0, -0.05, 0.4], 0.06, 0.25, 0x5a6472, { axis: "z", metalness: 0.4, roughness: 0.5 }),
    explodeOffset: [-0.5, 0.3, 0.1],
    info: {
      functie:
        "Zet met een chemische reactie via een edelmetaalcoating schadelijke uitlaatgassen om in minder schadelijke stoffen — verplicht voor een goedgekeurde APK/RDW-keuring.",
      volgorde:
        "Tussen voor- en middenpijp gemonteerd, na de lambdasonde.",
      fouten:
        "Bij een 'track only' drift-build de katalysator verwijderen ('cat-delete') zonder te beseffen dat de auto dan niet meer straatlegaal is voor de APK — een populaire maar niet-legale aanpassing voor vermogen en geluid.",
    },
  });

  defs.push({
    id: "middenpijp",
    name: "Middenpijp",
    order: 4,
    color: 0x707070,
    mesh: makeCurvedTube([[0, -0.05, 0.27], [0, -0.07, 0.1], [0, -0.08, -0.1]], 0.032, 0x707070, { metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, 0.2, -0.2],
    info: {
      functie:
        "Verbindt de katalysator met de middendemper en overbrugt de afstand onder de cabine door.",
      volgorde:
        "Tussen katalysator en middendemper gemonteerd.",
      fouten:
        "De pijp te strak (zonder enige speling) in de ophangrubbers monteren — het hele uitlaatsysteem zet uit en krimpt met de temperatuur en moet daardoor een beetje kunnen 'werken'.",
    },
  });

  defs.push({
    id: "middendemper",
    name: "Middendemper (resonator)",
    order: 5,
    color: 0x4a5568,
    mesh: makeCylinder([0, -0.08, -0.3], 0.07, 0.3, 0x4a5568, { axis: "z", metalness: 0.4, roughness: 0.5 }),
    explodeOffset: [-0.5, 0.3, -0.3],
    info: {
      functie:
        "Dempt specifieke, hinderlijke geluidsfrequenties voordat de gassen bij de einddemper aankomen.",
      volgorde:
        "Tussen midden- en achterpijp gemonteerd.",
      fouten:
        "De middendemper verwijderen ('straight piping') voor een luider geluid, zonder te beseffen dat dit vaak een onaangenaam dreunend/resonerend geluid in de cabine geeft bij bepaalde toerentallen, in plaats van het gewenste sportieve geluid.",
    },
  });

  defs.push({
    id: "achterpijp",
    name: "Achterpijp",
    order: 6,
    color: 0x707070,
    mesh: makeCurvedTube([[0, -0.08, -0.45], [0.08, -0.09, -0.6], [0.15, -0.1, -0.75]], 0.032, 0x707070, { metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, 0.2, -0.5],
    info: {
      functie:
        "Voert de gassen van de middendemper naar de einddemper aan het einde van de auto.",
      volgorde:
        "Tussen middendemper en einddemper gemonteerd.",
      fouten:
        "De pijp laten schuren tegen de achterasdraagbalk of aandrijfas bij een verlaagde drift-setup — geeft op termijn een doorgesleten gat, met geluidslekkage en CO-risico tot gevolg.",
    },
  });

  defs.push({
    id: "einddemper",
    name: "Einddemper (achterdemper)",
    order: 7,
    color: 0x394452,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeCylinder([0.15, -0.1, -0.92], 0.09, 0.35, 0x394452, { axis: "z", metalness: 0.4, roughness: 0.5 }));
      group.add(makeCylinder([0.15, -0.1, -1.12], 0.04, 0.08, 0x2f3644, { axis: "z", metalness: 0.6 }));
      return group;
    })(),
    explodeOffset: [-0.4, 0.3, -0.8],
    info: {
      functie:
        "Dempt het resterende uitlaatgeluid tot een acceptabel niveau en bepaalt mede de finale klank van de auto.",
      volgorde:
        "Als laatste onderdeel van het uitlaatsysteem gemonteerd.",
      fouten:
        "Een 'race'-einddemper puur op decibel-opgave kiezen zonder rekening te houden met de plaatselijke geluidsnormen voor track days — kan een verder klaar staande build alsnog van de baan houden.",
    },
  });

  defs.push({
    id: "ophangrubbers",
    name: "Ophangrubbers",
    order: 8,
    color: 0x20242c,
    mesh: (() => {
      const group = new THREE.Group();
      [
        [0, -0.16, 0.3],
        [0, -0.19, -0.05],
        [0.1, -0.2, -0.6],
      ].forEach((p) => group.add(makeTorus(p, 0.03, 0.008, 0x20242c, { axis: "z" })));
      return group;
    })(),
    explodeOffset: [0, -0.6, 0],
    info: {
      functie:
        "Hangen het hele uitlaatsysteem trillingsvrij aan de onderzijde van de auto, en laten het geheel een beetje bewegen bij het uitzetten door warmte.",
      volgorde:
        "Over de hele lengte van het systeem gemonteerd, als laatste stap om alles spanningsvrij op zijn plek te laten hangen.",
      fouten:
        "Verharde of afgescheurde rubbers laten zitten — het uitlaatsysteem gaat dan rammelen, en kan bij een drift-build met verminderde bodemvrijheid zelfs over de weg gaan slepen.",
    },
  });

  return defs;
}
