// Schematische geometrie + kennisdata voor koppeling en versnellingsbak van een BMW E36.
// Coordinatensysteem (meters): z>0 richting motor/vliegwiel, z<0 richting cardanas/achteras.

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "koppeling-bak",
  name: "Koppeling & versnellingsbak",
  short: "Bak",
  description:
    "Van vliegwiel tot cardanas-flens: koppelingsplaat, drukgroep, uitrapperlager, versnellingsbak en de hydrauliek — met de clutch-kick in het achterhoofd.",
  cameraPosition: [1.9, 1.2, 2.0],
  cameraTarget: [0, 0.05, -0.1],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "vliegwiel",
    name: "Vliegwiel",
    order: 1,
    color: 0x4a5568,
    mesh: makeCylinder([0, 0, 0.15], 0.11, 0.03, 0x4a5568, { axis: "z", metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [0, 0, 0.8],
    info: {
      functie:
        "Vergroot de draaimassa van de krukas voor een gelijkmatige loop bij lage toerentallen, en vormt het contactvlak voor de koppelingsplaat. Lichtere ('lightweight') vliegwielen zijn een populaire drift-mod: de motor kan dan sneller revven, handig voor snellere clutch kicks.",
      volgorde:
        "Rechtstreeks op de krukas gemonteerd, als eerste onderdeel van de koppeling.",
      fouten:
        "Een lichtgewicht vliegwiel monteren zonder te beseffen dat de motor daardoor onrustiger stationair kan lopen en minder vloeiend wegtrekt vanuit stilstand — een bekende trade-off die niet iedereen prettig vindt op de openbare weg.",
    },
  });

  defs.push({
    id: "koppelingsplaat",
    name: "Koppelingsplaat",
    order: 2,
    color: 0x707070,
    mesh: makeCylinder([0, 0, 0.12], 0.1, 0.012, 0x707070, { axis: "z", metalness: 0.4, roughness: 0.6 }),
    explodeOffset: [0.3, 0, 0.3],
    info: {
      functie:
        "Brengt het motorkoppel via wrijving over naar de versnellingsbak, en ontkoppelt dit tijdelijk zodra het koppelingspedaal wordt ingetrapt.",
      volgorde:
        "Tussen vliegwiel en drukgroep geplaatst, gecentreerd met een speciaal centreergereedschap vóórdat de bak wordt teruggeplaatst.",
      fouten:
        "De koppelingsplaat niet centreren vóór het vastzetten van de drukgroep — de ingaande as van de bak past dan niet meer soepel terug, of beschadigt de plaat bij het terugplaatsen.",
    },
  });

  defs.push({
    id: "drukgroep",
    name: "Drukgroep",
    order: 3,
    color: 0x394452,
    mesh: makeCylinder([0, 0, 0.08], 0.105, 0.05, 0x394452, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [-0.3, 0, 0.5],
    info: {
      functie:
        "Klemt de koppelingsplaat met veerkracht tegen het vliegwiel, en geeft die klemkracht vrij zodra het uitrapperlager tegen het diafragma drukt.",
      volgorde:
        "Over de gecentreerde koppelingsplaat op het vliegwiel gebout.",
      fouten:
        "Bij een drift-build een te zware (stijve) drukgroep kiezen voor meer koppelcapaciteit, zonder te beseffen dat dit het inkoppelen — en dus het uitvoeren van een nette clutch kick — juist zwaarder en minder fijngevoelig maakt.",
    },
  });

  defs.push({
    id: "uitrapperlager",
    name: "Uitrapperlager",
    order: 4,
    color: 0x8a94a3,
    mesh: makeTorus([0, 0, 0.03], 0.055, 0.02, 0x8a94a3, { axis: "z", metalness: 0.6 }),
    explodeOffset: [0, 0.4, 0.2],
    info: {
      functie:
        "Drukt, aangestuurd door het koppelingspedaal, tegen het diafragma van de drukgroep om de koppeling te ontkoppelen.",
      volgorde:
        "Op de ingaande as van de bak gemonteerd, vóórdat de bak tegen de motor wordt geplaatst.",
      fouten:
        "Het lager 'droog' laten lopen doordat het geleidebusje niet is ingevet — geeft een piepend of schurend geluid bij het intrappen van de koppeling, en versnelde slijtage.",
    },
  });

  defs.push({
    id: "versnellingsbakhuis",
    name: "Versnellingsbakhuis",
    order: 5,
    color: 0x5a6472,
    mesh: makeBox([0, 0, -0.28], [0.22, 0.22, 0.55], 0x5a6472),
    explodeOffset: [0, -0.3, -0.9],
    info: {
      functie:
        "Huisvest de tandwielen die de verschillende overbrengingsverhoudingen (versnellingen) mogelijk maken tussen motor en differentieel.",
      volgorde:
        "Als geheel tegen het motorblok gebout, met de ingaande as door de koppeling heen, nadat vliegwiel en koppeling al gemonteerd zijn.",
      fouten:
        "De bak schuin tegen de motor drukken tijdens montage in plaats van recht — de ingaande as kan dan vastlopen in het naaflager (pilot bearing) van de krukas, waardoor de bak niet meer op zijn plek past.",
    },
  });

  defs.push({
    id: "schakelstang",
    name: "Schakelstang",
    order: 6,
    color: 0x2f3644,
    mesh: makeLink([0, 0.12, -0.15], [0.05, 0.55, 0.35], 0.02, 0x2f3644),
    explodeOffset: [-0.4, 0.3, 0.3],
    info: {
      functie:
        "Brengt de handbeweging van de pook over naar de schakelvorken in de bak, die op hun beurt de juiste tandwielen laten koppelen.",
      volgorde:
        "Aangesloten nadat de bak op zijn plek zit, met de pookhuisrubbers als laatste stap.",
      fouten:
        "Versleten schakelstangrubbers of -bussen laten zitten — geeft een 'los' of onnauwkeurig schakelgevoel, vervelend bij snel en herhaald schakelen tijdens een drift-run.",
    },
  });

  defs.push({
    id: "aandrijfflens",
    name: "Aandrijfflens (naar cardanas)",
    order: 7,
    color: 0x707070,
    mesh: makeCylinder([0, 0, -0.56], 0.06, 0.03, 0x707070, { axis: "z", metalness: 0.6 }),
    explodeOffset: [0, 0, -0.7],
    info: {
      functie:
        "Verbindt de uitgaande as van de bak met de cardanas richting het differentieel.",
      volgorde:
        "Als laatste aan de achterkant van de bak gemonteerd, vóórdat de cardanas wordt aangesloten.",
      fouten:
        "De flensbout niet op het voorgeschreven (hoge) aandraaimoment vastzetten — bij herhaalde koppelstoten zoals clutch kicks staat deze verbinding onder extra belasting.",
    },
  });

  const slaveCenter = [0.16, -0.02, 0.02];
  defs.push({
    id: "koppelingshydrauliek",
    name: "Koppelingshydrauliek",
    order: 8,
    color: 0xb5bdc9,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeCylinder(slaveCenter, 0.03, 0.08, 0xb5bdc9, { axis: "x", metalness: 0.5 }));
      group.add(makeCurvedTube([slaveCenter, [0.3, 0.3, 0.3], [0.35, 0.55, 0.55]], 0.01, 0xb5bdc9, { metalness: 0.5 }));
      return group;
    })(),
    explodeOffset: [0.6, 0.3, 0.3],
    info: {
      functie:
        "Zet de trapkracht op het koppelingspedaal hydraulisch om in een duwkracht op het uitrapperlager, via een hoofdcilinder bij het pedaal en een slave-cilinder bij de bak.",
      volgorde:
        "Aangesloten nadat pedaal en bak gemonteerd zijn; als laatste stap ontlucht.",
      fouten:
        "Het hydraulische circuit niet ontluchten na werkzaamheden — geeft een 'zacht' of onvoorspelbaar koppelingspedaal, funest voor de timing die nodig is bij een clutch kick.",
    },
  });

  defs.push({
    id: "baksteun",
    name: "Baksteun",
    order: 9,
    color: 0x2f3644,
    mesh: makeLink([0, -0.11, -0.35], [0, -0.45, -0.35], 0.035, 0x2f3644),
    explodeOffset: [0, -0.9, -0.2],
    info: {
      functie:
        "Draagt het gewicht van de versnellingsbak en isoleert trillingen, terwijl de bak stevig uitgelijnd blijft met motor en cardanas.",
      volgorde:
        "Gemonteerd nadat de bak op zijn plek hangt, als bevestiging aan de carrosserie/tunnel.",
      fouten:
        "Een verharde of gescheurde rubber baksteun laten zitten — geeft extra bakbeweging onder belasting, wat bij veel clutch kicks en harde schakelmomenten sneller tot een verkeerde uitlijning met de cardanas kan leiden.",
    },
  });

  return defs;
}
