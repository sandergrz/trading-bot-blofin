// Schematische geometrie + kennisdata voor het brandstofsysteem van een BMW E36.
// Coordinatensysteem (meters): z<0 tank (achterkant auto), z>0 motorruimte.

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "brandstofsysteem",
  name: "Brandstofsysteem",
  short: "Brandstof",
  description:
    "Van tank tot injector: pomp, filter, rail en drukregelaar — inclusief waarom bijna-leeg rijden de pomp sneller slijt.",
  cameraPosition: [2.8, 1.6, 3.1],
  cameraTarget: [0, 0.05, -0.1],
};

export function createParts() {
  const defs = [];

  const tankCenter = [0, -0.1, -0.8];
  defs.push({
    id: "brandstoftank",
    name: "Brandstoftank",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox(tankCenter, [0.5, 0.25, 0.4], 0x4a5568),
    explodeOffset: [0, -0.6, -0.9],
    info: {
      functie:
        "Voorraadvat voor de brandstof, met inwendig de brandstofpomp en het niveaumeetsysteem. Bij de E36 sedan/coupé zit de tank boven de achteras, onder de bagageruimte.",
      volgorde:
        "Als een van de eerste onderdelen gemonteerd bij een opbouw, met pomp en niveaumeter er al in, vóórdat de leidingen worden aangesloten.",
      fouten:
        "De tank met resten oude, verontreinigde brandstof of roest laten zitten bij een revisie — losrakend vuil kan het hele systeem stroomafwaarts (filter, injectoren) verstoppen.",
    },
  });

  const pumpCenter = [0, -0.02, -0.8];
  defs.push({
    id: "brandstofpomp",
    name: "Brandstofpomp",
    order: 2,
    color: 0x707070,
    mesh: makeCylinder(pumpCenter, 0.04, 0.16, 0x707070, { axis: "y", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.3, 0.3, -0.5],
    info: {
      functie:
        "Brengt de brandstof onder druk van de tank naar de motor. Bij benzinemotoren zit de pomp vrijwel altijd in de tank, waar de brandstof zelf de pomp koelt en smeert.",
      volgorde:
        "In de tank gemonteerd, vóórdat deze wordt ingebouwd.",
      fouten:
        "De auto herhaaldelijk (bijna) leeg laten rijden — de pomp kan dan oververhitten doordat er onvoldoende brandstof is om hem te koelen, wat de levensduur flink verkort. Bij een build met meer vermogen (en dus meer brandstofbehoefte) wordt de pomp vaak vervangen door een exemplaar met hogere capaciteit.",
    },
  });

  defs.push({
    id: "niveaumeter",
    name: "Brandstofniveaumeter",
    order: 3,
    color: 0xd0a23a,
    mesh: makeLink([0.12, -0.02, -0.8], [0.2, -0.15, -0.75], 0.012, 0xd0a23a),
    explodeOffset: [0.5, -0.2, -0.4],
    info: {
      functie:
        "Meet met een drijver (vlotter) het brandstofniveau in de tank en stuurt dit door naar de benzinemeter op het dashboard.",
      volgorde:
        "Samen met de pomp in de tank gemonteerd.",
      fouten:
        "De vlotterarm verbuigen bij montage, waardoor de benzinemeter een structureel verkeerd (te hoog of te laag) niveau blijft aangeven.",
    },
  });

  defs.push({
    id: "brandstoffilter",
    name: "Brandstoffilter",
    order: 4,
    color: 0x394452,
    mesh: makeCylinder([0, -0.15, -0.4], 0.035, 0.12, 0x394452, { axis: "z", metalness: 0.4 }),
    explodeOffset: [-0.4, 0.3, -0.1],
    info: {
      functie:
        "Houdt vuildeeltjes uit de brandstof tegen voordat deze de gevoelige injectoren bereikt.",
      volgorde:
        "In de toevoerleiding gemonteerd, tussen tank en motor.",
      fouten:
        "Het filter nooit vervangen volgens onderhoudsschema — een verstopt filter beperkt de brandstofstroom, wat zich vooral uit als vermogensverlies bij hoge belasting, precies de situatie tijdens hard driften.",
    },
  });

  const railStart = [0, 0.25, 0.5];
  const railEnd = [0, 0.25, 0.85];
  defs.push({
    id: "toevoerleiding",
    name: "Toevoerleiding",
    order: 5,
    color: 0xb5bdc9,
    mesh: makeCurvedTube([tankCenter, [0, -0.15, -0.4], [0, 0.05, 0.1], railStart], 0.014, 0xb5bdc9, { metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [0.5, 0.2, 0.3],
    info: {
      functie:
        "Voert de brandstof onder druk van tank en filter naar de brandstofrail bij de motor.",
      volgorde:
        "Aangesloten nadat tank, pomp en filter gemonteerd zijn.",
      fouten:
        "De leiding laten schuren tegen scherpe randen van carrosserie of ophanging — een brandstoflek is, anders dan een koelvloeistof- of olielek, direct een serieus brandgevaar.",
    },
  });

  defs.push({
    id: "brandstofrail",
    name: "Brandstofrail",
    order: 6,
    color: 0x6e7889,
    mesh: makeLink(railStart, railEnd, 0.018, 0x6e7889, { metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [0, 0.5, 0.4],
    info: {
      functie:
        "Verdeelt de brandstof gelijkmatig over alle injectoren en houdt vlak bij de motor een constante druk vast.",
      volgorde:
        "Op de cilinderkop/het inlaatspruitstuk gemonteerd, met de injectoren er al in, vóórdat de toevoerleiding wordt aangesloten.",
      fouten:
        "De bevestigingsbouten van de rail niet gelijkmatig aandraaien, waardoor de rail scheef trekt en de afdichtingen van de injectoren onder ongelijke spanning komen te staan.",
    },
  });

  const injectorGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const z = railStart[2] + (i * (railEnd[2] - railStart[2])) / 2;
    injectorGroup.add(makeCylinder([0, 0.16, z], 0.014, 0.1, 0x2f3644, { metalness: 0.5 }));
  }
  defs.push({
    id: "injectoren",
    name: "Injectoren",
    order: 7,
    color: 0x2f3644,
    mesh: injectorGroup,
    explodeOffset: [0.4, -0.3, 0.5],
    info: {
      functie:
        "Spuiten op het juiste moment en met de juiste hoeveelheid brandstof het inlaatkanaal in, aangestuurd door de motorcomputer.",
      volgorde:
        "In de brandstofrail gemonteerd, vóórdat deze op de motor geplaatst wordt.",
      fouten:
        "Bij een vermogens-upgrade (bijvoorbeeld een turbo of grotere motor) de originele injectoren behouden terwijl ze de benodigde brandstofhoeveelheid niet meer aankunnen — dit geeft een te mager mengsel, wat op de lange termijn motorschade veroorzaakt.",
    },
  });

  defs.push({
    id: "drukregelaar",
    name: "Brandstofdrukregelaar",
    order: 8,
    color: 0xd0a23a,
    mesh: makeCylinder([0, 0.28, 0.88], 0.03, 0.07, 0xd0a23a, { axis: "y", metalness: 0.4 }),
    explodeOffset: [0.3, 0.5, 0.2],
    info: {
      functie:
        "Houdt de druk in de brandstofrail constant, ongeacht de inlaatonderdruk van de motor, door overtollige brandstof terug te laten stromen naar de tank.",
      volgorde:
        "Aan het eind van de brandstofrail gemonteerd, met de retourleiding erop aangesloten.",
      fouten:
        "Een drukregelaar met een verkeerde instelling monteren bij een gewijzigde motoropbouw — dit verstoort het brandstofmengsel net zo goed als een verkeerde injectorkeuze.",
    },
  });

  defs.push({
    id: "retourleiding",
    name: "Retourleiding",
    order: 9,
    color: 0x9aa4b5,
    mesh: makeCurvedTube([[0, 0.28, 0.88], [0, 0.0, 0.2], [0, -0.15, -0.4], tankCenter], 0.014, 0x9aa4b5, { metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [-0.4, 0.3, -0.4],
    info: {
      functie:
        "Voert overtollige, ongebruikte brandstof van de drukregelaar terug naar de tank, zodat het systeem een constante druk behoudt en de brandstof in de rail niet oververhit raakt.",
      volgorde:
        "Als laatste leiding van het circuit aangesloten.",
      fouten:
        "De retourleiding met de toevoerleiding verwisselen bij montage — het systeem bouwt dan geen druk op en de motor start niet, of loopt zeer onregelmatig.",
    },
  });

  return defs;
}
