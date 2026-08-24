// Schematische geometrie + kennisdata voor het koelsysteem van een BMW E36.
// Coordinatensysteem (meters): z>0 voorkant auto (radiateur), z<0 richting motor/firewall.

import * as THREE from "three";
import { makeBox, makeCylinder, makeTorus, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "koelsysteem",
  name: "Koelsysteem",
  short: "Koeling",
  description:
    "Radiateur, slangen, thermostaat, waterpomp en de ventilator/viscokoppeling — inclusief de populaire electrische-ventilator-swap.",
  cameraPosition: [2.4, 1.5, 2.6],
  cameraTarget: [0, 0.05, 0.3],
};

export function createParts() {
  const defs = [];

  const radiatorCenter = [0, 0, 0.62];
  defs.push({
    id: "radiateur",
    name: "Radiateur",
    order: 1,
    color: 0xb5bdc9,
    mesh: makeBox(radiatorCenter, [0.62, 0.42, 0.06], 0xb5bdc9, { metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [0, 0, 1.0],
    info: {
      functie:
        "Geeft de warmte van de hete koelvloeistof af aan de langsstromende lucht, via dunne lamellen voor een zo groot mogelijk oppervlak.",
      volgorde:
        "Als een van de eerste onderdelen vooraan gemonteerd, vóórdat de slangen worden aangesloten.",
      fouten:
        "De kunststof eindtanks van de (originele) radiateur zijn berucht om na verloop van jaren bros te worden en te scheuren, vooral rond de bevestigingsnokken — een groot deel van de 'plotselinge' koelvloeistoflekken bij een E36 komt hierdoor.",
    },
  });

  const engineTop = [0, 0.22, -0.15];
  const radiatorTop = [0, 0.19, radiatorCenter[2] - 0.03];
  defs.push({
    id: "bovenste-koelslang",
    name: "Bovenste koelslang",
    order: 2,
    color: 0x20242c,
    mesh: makeCurvedTube([engineTop, [0, 0.24, 0.25], radiatorTop], 0.022, 0x20242c, { roughness: 0.8 }),
    explodeOffset: [0.5, 0.3, 0],
    info: {
      functie:
        "Voert de hete koelvloeistof van de motor (thermostaathuis) naar de bovenkant van de radiateur.",
      volgorde:
        "Aangesloten nadat radiateur en thermostaathuis gemonteerd zijn.",
      fouten:
        "Een verharde, oude slang laten zitten 'omdat hij nog niet lekt' — dit soort slangen kan bij hoge temperatuur en druk, bijvoorbeeld tijdens intensieve drift-sessies, plotseling barsten.",
    },
  });

  const waterPumpCenter = [0, -0.1, -0.1];
  const radiatorBottom = [0, -0.19, radiatorCenter[2] - 0.03];
  defs.push({
    id: "onderste-koelslang",
    name: "Onderste koelslang",
    order: 3,
    color: 0x20242c,
    mesh: makeCurvedTube([radiatorBottom, [0, -0.22, 0.25], waterPumpCenter], 0.022, 0x20242c, { roughness: 0.8 }),
    explodeOffset: [0.5, -0.3, 0],
    info: {
      functie:
        "Voert de afgekoelde vloeistof van de onderkant van de radiateur terug naar de waterpomp.",
      volgorde:
        "Als laatste slang aangesloten, waarna het systeem gevuld en ontlucht wordt.",
      fouten:
        "Het systeem niet goed ontluchten na het verversen — een luchtbel bij de waterpomp of thermostaat kan lokale oververhitting veroorzaken zonder dat de temperatuurmeter dat meteen laat zien.",
    },
  });

  const thermostatCenter = [0, 0.15, -0.2];
  defs.push({
    id: "thermostaat",
    name: "Thermostaat",
    order: 4,
    color: 0xd0a23a,
    mesh: makeCylinder(thermostatCenter, 0.04, 0.06, 0xd0a23a, { axis: "y", metalness: 0.4 }),
    explodeOffset: [-0.5, 0.3, -0.2],
    info: {
      functie:
        "Blokkeert de doorstroom naar de radiateur totdat de motor op temperatuur is, en regelt daarna de doorstroming om een stabiele bedrijfstemperatuur te houden.",
      volgorde:
        "In het thermostaathuis gemonteerd, vóórdat de bovenste koelslang wordt aangesloten.",
      fouten:
        "Een thermostaat met een te lage openingstemperatuur monteren 'voor de zekerheid' — de motor bereikt dan nooit zijn optimale bedrijfstemperatuur, wat op de lange termijn juist tot meer slijtage en hoger verbruik leidt.",
    },
  });

  defs.push({
    id: "waterpomp",
    name: "Waterpomp",
    order: 5,
    color: 0x6e7889,
    mesh: makeCylinder(waterPumpCenter, 0.075, 0.09, 0x6e7889, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [-0.5, -0.3, -0.4],
    info: {
      functie:
        "Pompt de koelvloeistof rond door het hele circuit: blok, cilinderkop, kachel en radiateur.",
      volgorde:
        "Aan de voorkant van het blok gemonteerd, aangedreven door de distributie- of accessoireriem.",
      fouten:
        "Een sluipend lekkende as-afdichting wordt vaak pas laat opgemerkt, tot de pomp faalt en de motor binnen enkele minuten oververhit raakt.",
    },
  });

  const fanCenter = [0, 0, 0.05];
  const fanGroup = new THREE.Group();
  fanGroup.add(makeCylinder(fanCenter, 0.035, 0.08, 0x394452, { axis: "z", metalness: 0.5 }));
  fanGroup.add(makeTorus(fanCenter, 0.22, 0.015, 0x2f3644, { axis: "z" }));
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    fanGroup.add(
      makeBox(
        [Math.cos(angle) * 0.13, Math.sin(angle) * 0.13, fanCenter[2]],
        [0.16, 0.05, 0.01],
        0x2f3644,
        { rotationZ: angle }
      )
    );
  }
  defs.push({
    id: "ventilator",
    name: "Ventilator + viscokoppeling",
    order: 6,
    color: 0x2f3644,
    mesh: fanGroup,
    explodeOffset: [0, 0.2, 0.7],
    info: {
      functie:
        "Trekt extra lucht door de radiateur bij lage snelheid of stilstand, wanneer de rijwind niet volstaat. De viscokoppeling regelt de ventilatorsnelheid op basis van temperatuur, zodat de ventilator niet onnodig vermogen kost bij een koude motor.",
      volgorde:
        "Op de waterpomp-as gemonteerd, als een van de laatste onderdelen van het koelsysteem.",
      fouten:
        "Bij een drift-build wordt de zware, mechanische ventilator + viscokoppeling vaak vervangen door een lichtere elektrische ventilator om gewicht en parasitair vermogensverlies te besparen. Een veelgemaakte fout daarbij: een ondermaatse elektrische ventilator monteren, of eentje zonder goede temperatuurschakelaar, waardoor de koeling bij low-speed drift-sessies (veel gas, weinig rijwind) alsnog tekortschiet.",
    },
  });

  const expansionCenter = [0.42, 0.28, 0.15];
  defs.push({
    id: "expansievat",
    name: "Expansievat",
    order: 7,
    color: 0xd6dae2,
    mesh: makeCylinder(expansionCenter, 0.06, 0.16, 0xd6dae2, { axis: "y", transparent: true, opacity: 0.6, roughness: 0.2 }),
    explodeOffset: [0.6, 0.4, 0],
    info: {
      functie:
        "Vangt het volume van uitzettende, hete koelvloeistof op en laat lucht ontsnappen, zodat het systeem drukvast en luchtvrij blijft.",
      volgorde:
        "Los van het hoofdcircuit gemonteerd, met een kleine overloopslang aangesloten na het vullen van het systeem.",
      fouten:
        "Het vloeistofniveau alleen 'op het oog' controleren in het vaak verkleurde/troebele expansievat, zonder ooit te verversen — koelvloeistof verliest na verloop van jaren zijn corrosiewerende eigenschappen, ook als het niveau prima blijft.",
    },
  });

  defs.push({
    id: "radiateurdop",
    name: "Radiateurdop",
    order: 8,
    color: 0x394452,
    mesh: makeCylinder([expansionCenter[0], expansionCenter[1] + 0.1, expansionCenter[2]], 0.045, 0.03, 0x394452, { axis: "y", metalness: 0.5 }),
    explodeOffset: [0.3, 0.5, 0],
    info: {
      functie:
        "Houdt het systeem onder een lichte overdruk, wat het kookpunt van de koelvloeistof verhoogt en oververhitting bij hoge temperaturen voorkomt.",
      volgorde:
        "Als laatste onderdeel op het expansievat geplaatst, ná het vullen van het systeem.",
      fouten:
        "Een dop met de verkeerde drukwaarde monteren, of een oude dop hergebruiken waarvan de veer of afdichting verzwakt is — het systeem houdt dan onvoldoende druk vast en de vloeistof kan al bij een lagere temperatuur gaan koken.",
    },
  });

  return defs;
}
