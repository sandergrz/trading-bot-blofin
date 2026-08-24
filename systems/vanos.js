// Schematische geometrie + kennisdata voor de VANOS-eenheid (variabele nokkenastiming)
// van een BMW E36 zescilinder (M50TU/M52/S50). Dit was het oorspronkelijke idee achter
// deze tool, dus met net iets meer detail uitgewerkt dan de andere systemen.
//
// Coordinatensysteem (meters): z-as = as van nokkenas/kettingwiel (voorkant motor),
// x/y = radiaal vanaf het hart van de eenheid.

import * as THREE from "three";
import { makeLink, makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "vanos",
  name: "VANOS-eenheid",
  short: "VANOS",
  description:
    "De variabele nokkenastiming van de M50TU/M52/S50-zescilinder: van aandrijftandwiel tot het beruchte 'VANOS rattle'-slijtagepunt.",
  cameraPosition: [1.1, 0.7, 1.2],
  cameraTarget: [0, 0, 0.02],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "vanos-behuizing",
    name: "VANOS-behuizing",
    order: 1,
    color: 0x4a5568,
    mesh: makeCylinder([0, 0, 0], 0.1, 0.16, 0x4a5568, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0, 0.35, 0.15],
    info: {
      functie:
        "Huisvest het hydraulische verstelmechanisme dat de nokkenastiming continu variabel maakt: meer koppel bij laag toerental, meer vermogen bij hoog toerental. De vroege M50TU heeft alleen inlaat-VANOS, de M52TU/S50/S54 hebben 'dubbele VANOS' op zowel inlaat als uitlaat.",
      volgorde:
        "Gemonteerd aan de voorkant van de cilinderkop, uitgelijnd met de nokkenas, nadat de distributie is aangebracht maar vóórdat deze definitief wordt afgesteld.",
      fouten:
        "De behuizing monteren zonder de nokkenas eerst op de fabrieksmerktekens te zetten — de klepbediening (en dus de hele motor) raakt dan volledig verkeerd getimed.",
    },
  });

  const sprocketCenter = [0, 0, -0.11];
  defs.push({
    id: "aandrijftandwiel",
    name: "Aandrijftandwiel (kettingwiel)",
    order: 2,
    color: 0x2f3644,
    mesh: makeCylinder(sprocketCenter, 0.095, 0.025, 0x2f3644, { axis: "z", metalness: 0.6 }),
    explodeOffset: [0, -0.4, -0.3],
    info: {
      functie:
        "Wordt door de distributieketting aangedreven vanaf de krukas en vormt de 'buitenste' helft van het VANOS-mechanisme. De relatieve hoek tussen dit tandwiel en de nokkenas erachter bepaalt de klepafstelling.",
      volgorde:
        "Gemonteerd als onderdeel van de distributie, vóórdat het verstelmechanisme zelf wordt afgesteld.",
      fouten:
        "De klembout van het tandwiel niet op het juiste moment aandraaien — bij losraken 'springt' de timing, met (bij deze interference engines) potentieel zware motorschade tot gevolg.",
    },
  });

  defs.push({
    id: "verstelzuiger",
    name: "Verstelzuiger",
    order: 3,
    color: 0x8a94a3,
    mesh: makeCylinder([0, 0, 0.01], 0.05, 0.1, 0x8a94a3, { axis: "z", metalness: 0.7, roughness: 0.25 }),
    explodeOffset: [0.35, 0, 0.1],
    info: {
      functie:
        "Een hydraulisch bewogen zuiger met een schuine (helische) vertanding die — aangestuurd door oliedruk — het aandrijftandwiel en de nokkenas licht ten opzichte van elkaar verdraait, en zo de klepopening continu vervroegt of vertraagt.",
      volgorde:
        "In de behuizing gemonteerd, tussen het aandrijftandwiel en de nokkenas-koppeling.",
      fouten:
        "De zuiger of de behuizing beschadigen bij demontage, bijvoorbeeld door verkeerd gereedschap — dit is precisiewerk met kleine toleranties, geen onderdeel om met kracht los te wrikken.",
    },
  });

  defs.push({
    id: "nokkenas-koppeling",
    name: "Nokkenas-koppeling",
    order: 4,
    color: 0x707070,
    mesh: makeCylinder([0, 0, 0.1], 0.06, 0.05, 0x707070, { axis: "z", metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [0, 0.25, 0.55],
    info: {
      functie:
        "Verbindt de verstelzuiger met de nokkenas zelf, zodat de door de zuiger opgelegde verdraaiing direct de klepopeningstijden verandert.",
      volgorde:
        "Gemonteerd tussen zuiger en nokkenas, als sluitstuk van het mechanisme.",
      fouten:
        "Bij hermontage na demontage de nokkenas niet exact op de fabrieksmerktekens terugzetten — geeft een merkbaar ander (vaak onrustiger) motorkarakter, zonder dat dit per se een duidelijke storingscode oplevert.",
    },
  });

  const solenoidCenter = [0, 0.14, -0.02];
  defs.push({
    id: "magneetventiel",
    name: "Magneetventiel",
    order: 5,
    color: 0x394452,
    mesh: makeCylinder(solenoidCenter, 0.028, 0.09, 0x394452, { axis: "y", metalness: 0.5 }),
    explodeOffset: [0, 0.6, -0.1],
    info: {
      functie:
        "Stuurt, aangestuurd door de motorcomputer (DME), de oliedruk naar beide zijden van de verstelzuiger en bepaalt zo in welke richting en hoe snel de VANOS verstelt.",
      volgorde:
        "Op de behuizing gemonteerd, met de elektrische aansluiting en oliekanalen als laatste stap.",
      fouten:
        "Een VANOS-'rammelgeluid' bij koude start (het bekende 'VANOS rattle') toeschrijven aan de distributieketting, terwijl het vaak het magneetventiel of het bijbehorende zeefje/filter is dat vervuild is en de oliedruk niet snel genoeg opbouwt.",
    },
  });

  defs.push({
    id: "oliekanalen",
    name: "Oliedrukkanalen",
    order: 6,
    color: 0xb5bdc9,
    mesh: makeCurvedTube(
      [
        [solenoidCenter[0], solenoidCenter[1] - 0.05, solenoidCenter[2]],
        [0.06, 0.06, 0],
        [0.03, 0.02, 0.02],
      ],
      0.01,
      0xb5bdc9,
      { metalness: 0.5, roughness: 0.35 }
    ),
    explodeOffset: [0.2, 0.4, -0.2],
    info: {
      functie:
        "Voeren gefilterde motorolie onder druk naar beide zijden van de verstelzuiger — essentieel voor een snelle en nauwkeurige verstelling.",
      volgorde:
        "Intern in blok/kop aangelegd en aangesloten op het magneetventiel, vóórdat de behuizing wordt afgesloten.",
      fouten:
        "Het VANOS-oliezeefje — een klein filtertje specifiek voor dit circuit — nooit reinigen bij onderhoud. Dit is een veelvoorkomende, makkelijk te voorkomen oorzaak van trage of haperende VANOS-werking op oudere E36's.",
    },
  });

  defs.push({
    id: "afdichtingen",
    name: "Afdichtingen (O-ringen/seals)",
    order: 7,
    color: 0xd0a23a,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeTorus([0, 0, -0.07], 0.06, 0.008, 0xd0a23a, { axis: "z", metalness: 0.3, roughness: 0.5 }));
      group.add(makeTorus([0, 0, 0.06], 0.045, 0.007, 0xd0a23a, { axis: "z", metalness: 0.3, roughness: 0.5 }));
      return group;
    })(),
    explodeOffset: [-0.4, -0.2, 0.05],
    info: {
      functie:
        "Houden de oliedruk in de verstelkamers van de zuiger vast. Zonder goede afdichting lekt de druk weg en verstelt de VANOS traag of helemaal niet meer.",
      volgorde:
        "Bij montage van behuizing en zuiger als laatste geplaatst, vlak vóór het dichtdraaien van de behuizing.",
      fouten:
        "Dit is hét bekende zwakke punt van de E36 VANOS-eenheid: de afdichtingen worden met de tijd hard en poreus, wat het dove 'VANOS rattle'-geluid bij koud starten geeft en het motorvermogen in het lage/middenregister merkbaar terugbrengt. Vaak de eerste check bij een E36 die 'niet meer trekt zoals vroeger'.",
    },
  });

  defs.push({
    id: "nokkenassensor",
    name: "Nokkenassensor",
    order: 8,
    color: 0x2f3644,
    mesh: makeLink([0.12, 0, 0.04], [0.2, 0, 0.06], 0.012, 0x2f3644),
    explodeOffset: [0.5, 0, 0.2],
    info: {
      functie:
        "Meet de actuele hoekpositie van de nokkenas en geeft dit terug aan de motorcomputer, die daarmee de werkelijke VANOS-stand bevestigt en zo nodig bijstuurt.",
      volgorde:
        "Radiaal in de cilinderkop gemonteerd, gericht op een tandwiel op de nokkenas, als een van de laatste stappen.",
      fouten:
        "De sensor met een verkeerde luchtspleet (afstand tot het tandwiel) monteren — het signaal wordt dan onbetrouwbaar en de motorcomputer kan de VANOS-timing niet correct bijsturen.",
    },
  });

  return defs;
}
