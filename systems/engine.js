// Schematische geometrie + kennisdata voor de motor die momenteel in de auto zit:
// de M40B18 — een SOHC 1.8 viercilinder zonder VANOS, de basismotor waarmee de
// E36 316i/318i oorspronkelijk werd geleverd. Uitgewerkt tot op onderdeelniveau
// (smeersysteem, klepbediening, ontsteking, inlaattraject, motormanagement),
// niet alleen op blokniveau. Blijft ook relevant als referentie zodra er een
// zescilinder (M50/M52/S50/S54) voor terugkomt — vandaar de swap-context in
// een aantal teksten hieronder.
//
// Coordinatensysteem (meters): x=0 hart van de motor, y=0 onderkant blok,
// z>0 voorkant motor (poelie-/radiateurzijde), z<0 vliegwielzijde (richting bak).

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeSphere, makeCurvedTube } from "./helpers.js";

export const meta = {
  id: "motor",
  name: "Motor",
  short: "Motor",
  description:
    "De huidige motor tot op onderdeelniveau: de M40B18 (SOHC 1.8, viercilinder, geen VANOS, tandriem) — van smeersysteem tot ontsteking en motormanagement.",
  cameraPosition: [2.7, 1.7, 2.5],
  cameraTarget: [0, 0.15, 0],
};

const CYLINDER_COUNT = 4;
const CYLINDER_Z = Array.from({ length: CYLINDER_COUNT }, (_, i) => -0.18 + (i * 0.36) / (CYLINDER_COUNT - 1));

export function createParts() {
  const defs = [];

  // --- Blok & carter ------------------------------------------------------

  defs.push({
    id: "motorblok",
    name: "Motorblok",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox([0, 0.05, 0], [0.46, 0.46, 0.55], 0x4a5568),
    explodeOffset: [0, -1.3, 0],
    info: {
      functie:
        "Het blok huisvest de vier cilinders, de krukas en het grootste deel van het smeersysteem. In deze auto zit momenteel de M40B18: een 1.8 liter SOHC-viercilinder (M40-serie), de basismotor waarmee de E36 316i/318i oorspronkelijk geleverd werd.",
      volgorde:
        "Wordt als eerste op de motorsteunen in de motorruimte geplaatst, vóórdat kop, kleppendeksel en hulpstukken worden gemonteerd.",
      fouten:
        "De M40B18 is een prima betrouwbare basismotor, maar met relatief weinig vermogen (rond de 90-100 pk) voor serieus driften. Bij een motorswap vanuit dit blok — in de E36 drift-scene erg populair, denk aan een M50/M52/S50/S54-zescilinder of zelfs 2JZ/LS-swaps — de motorsteunen en het extra motorgewicht niet goed doorrekenen: een te zwaar of verkeerd gepositioneerd blok verstoort de gewichtsverdeling en daarmee het drift-gedrag van de auto.",
    },
  });

  const crankCenter = [0, -0.07, 0];
  const hoofdlagersGroup = new THREE.Group();
  [-0.16, -0.053, 0.053, 0.16].forEach((z) => {
    hoofdlagersGroup.add(makeCylinder([0, -0.13, z], 0.05, 0.02, 0x707070, { axis: "z", metalness: 0.6, roughness: 0.3 }));
  });
  defs.push({
    id: "hoofdlagers",
    name: "Hoofdlagers",
    order: 2,
    color: 0x707070,
    mesh: hoofdlagersGroup,
    explodeOffset: [0, -0.6, 0.3],
    info: {
      functie:
        "Dragen de krukas in het blok en zorgen voor een dunne oliefilm tussen krukas en blok, zodat er geen metaal-op-metaal contact ontstaat.",
      volgorde:
        "Bij de opbouw van het kale blok gemonteerd, met de juiste lagerspeling, vóór het plaatsen van de krukas zelf.",
      fouten:
        "De lagerschalen tussen posities verwisselen — ze zijn per positie vaak net iets verschillend van dikte. Dat geeft plaatselijk verkeerde speling en versnelde slijtage, precies op de plek waar je het niet wilt.",
    },
  });

  defs.push({
    id: "krukas",
    name: "Krukas",
    order: 3,
    color: 0x8a94a3,
    mesh: makeCylinder(crankCenter, 0.042, 0.5, 0x8a94a3, { axis: "z", metalness: 0.7, roughness: 0.25 }),
    explodeOffset: [0, -0.5, 0],
    info: {
      functie:
        "Zet de op-en-neergaande beweging van de vier zuigers om in een draaiende beweging, die uiteindelijk via koppeling, versnellingsbak en differentieel de achterwielen aandrijft.",
      volgorde:
        "Op de hoofdlagers in het blok gelegerd, vóórdat zuigers en drijfstangen gemonteerd worden.",
      fouten:
        "De aandraaivolgorde en het aandraaimoment van de hoofdlagerkappen niet aanhouden — leidt tot vroegtijdige lagerschade.",
    },
  });

  const pistonGroup = new THREE.Group();
  CYLINDER_Z.forEach((z) => {
    pistonGroup.add(makeCylinder([0, 0.15, z], 0.048, 0.09, 0x9aa4b5, { metalness: 0.6, roughness: 0.3 }));
  });
  defs.push({
    id: "zuigers",
    name: "Zuigers",
    order: 4,
    color: 0x9aa4b5,
    mesh: pistonGroup,
    explodeOffset: [0, 0.7, 0.2],
    info: {
      functie:
        "Zetten de verbrandingsdruk om in een kracht op de drijfstangen en de krukas. Zuigerveren (ringen) dichten de cilinder af tegen de cilinderwand en beperken olieverbruik.",
      volgorde:
        "Gemonteerd nadat de krukas in het blok ligt, samen met de drijfstangen, vóórdat de cilinderkop erop geplaatst wordt.",
      fouten:
        "Zuigerveren verkeerd om monteren (ze hebben vaak een bovenkant/onderkant) — geeft verhoogd olieverbruik en drukverlies in de cilinder.",
    },
  });

  const rodsGroup = new THREE.Group();
  CYLINDER_Z.forEach((z) => {
    rodsGroup.add(makeLink([0, 0.11, z], [crankCenter[0], crankCenter[1], z], 0.014, 0x707070));
  });
  defs.push({
    id: "drijfstangen",
    name: "Drijfstangen",
    order: 5,
    color: 0x707070,
    mesh: rodsGroup,
    explodeOffset: [0, 0.5, -0.3],
    info: {
      functie:
        "Verbinden de zuigers met de krukas en zetten de op-en-neergaande beweging om in de draaiende beweging van de krukas.",
      volgorde:
        "Samen met de zuigers gemonteerd, met de drijfstanglagers voorzien van de juiste speling.",
      fouten:
        "Geen complete, gelijk-gewogen set drijfstangen gebruiken bij een revisie — een ongebalanceerde set geeft trillingen die toenemen met het toerental.",
    },
  });

  const carterCenter = [0, -0.25, 0];
  defs.push({
    id: "carter",
    name: "Carter (oliecarter)",
    order: 6,
    color: 0x2f3644,
    mesh: makeBox(carterCenter, [0.42, 0.13, 0.5], 0x2f3644),
    explodeOffset: [0, -1.1, -0.2],
    info: {
      functie:
        "Verzamelt de motorolie onderin het blok en huisvest de aanzuigzeef van de oliepomp.",
      volgorde:
        "Als een van de laatste stappen onderaan het blok gemonteerd, met een nieuwe pakking.",
      fouten:
        "De carterbout (aftapplug) met een versleten sluitring hergebruiken — een klassieke, sluipende oorzaak van een olievlek op de oprit.",
    },
  });

  const oilPumpCenter = [0, -0.15, 0.24];
  defs.push({
    id: "oliepomp",
    name: "Oliepomp",
    order: 7,
    color: 0x6e7889,
    mesh: makeCylinder(oilPumpCenter, 0.05, 0.06, 0x6e7889, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.4, -0.5, 0.5],
    info: {
      functie:
        "Verzorgt de oliedruk in het hele smeersysteem — zuigt olie aan uit het carter en perst die naar de hoofd-, drijfstang- en nokkenaslagers.",
      volgorde:
        "Aan de voorkant van het blok gemonteerd, direct aangedreven vanaf de krukas, vóórdat het carter erop komt.",
      fouten:
        "Een motor die lang met een te laag oliepeil heeft gedraaid als 'waarschijnlijk wel oké' beschouwen — de oliepomp kan dan tijdelijk lucht hebben aangezogen, met verminderde smering (en dus lagerschade) tot gevolg, ook als het daarna weer goed leek te lopen.",
    },
  });

  const oilFilterCenter = [-0.26, -0.05, 0.08];
  defs.push({
    id: "oliefilter",
    name: "Oliefilter",
    order: 8,
    color: 0x394452,
    mesh: makeCylinder(oilFilterCenter, 0.045, 0.12, 0x394452, { axis: "y", metalness: 0.4, roughness: 0.5 }),
    explodeOffset: [-0.6, -0.2, 0.3],
    info: {
      functie:
        "Filtert vuildeeltjes uit de motorolie voordat deze terug de smeerkanalen ingaat, en behoudt zo de smerende werking van de olie.",
      volgorde:
        "Aan de zijkant van het blok geschroefd, aangesloten op het oliecircuit.",
      fouten:
        "Het filter met de hand strak aandraaien 'voor de zekerheid' in plaats van volgens voorschrift (vaak handvast plus een kwartslag) — te vast maakt het er de volgende keer vrijwel onmogelijk af te krijgen zonder het filter te beschadigen.",
    },
  });

  // --- Cilinderkop & klepbediening -----------------------------------------

  defs.push({
    id: "cilinderkop",
    name: "Cilinderkop",
    order: 9,
    color: 0x5a6472,
    mesh: makeBox([0, 0.32, 0], [0.42, 0.2, 0.52], 0x5a6472),
    explodeOffset: [0, 1.0, 0],
    info: {
      functie:
        "Sluit de cilinders af en huisvest de kleppen en de nokkenas. De M40 is een SOHC-motor: één nokkenas, 8 kleppen (2 per cilinder), zonder VANOS — variabele klepafstelling kwam pas later, met de M50TU-zescilinder in de line-up.",
      volgorde:
        "Op het blok gemonteerd nadat zuigers en drijfstangen erin zitten, met een nieuwe koppakking ertussen.",
      fouten:
        "De kopbouten niet in de voorgeschreven volgorde en in meerdere stappen tot het einddraaimoment aandraaien — geeft een ongelijkmatig afgedichte koppakking en verhoogt de kans op lekkage of een doorgeslagen pakking.",
    },
  });

  const camshaftCenter = [0, 0.36, 0];
  defs.push({
    id: "nokkenas",
    name: "Nokkenas",
    order: 10,
    color: 0x8a94a3,
    mesh: makeCylinder(camshaftCenter, 0.022, 0.48, 0x8a94a3, { axis: "z", metalness: 0.7, roughness: 0.25 }),
    explodeOffset: [0, 0.9, 0.4],
    info: {
      functie:
        "Opent en sluit, aangedreven door de distributieriem, op het juiste moment de kleppen via de tuimelaars — bepaalt zo direct de klepoverlap en daarmee het koppel- en vermogenskarakter van de motor.",
      volgorde:
        "In de cilinderkop gelegerd vóórdat de tuimelaars en de riem gemonteerd worden.",
      fouten:
        "Bij een aftermarket nokkenas de as niet op het juiste merkteken (of verwisseld inlaat/uitlaat-profiel) monteren — verstoort de timing net zo goed als een verkeerd gemonteerde riem.",
    },
  });

  const valvesGroup = new THREE.Group();
  CYLINDER_Z.forEach((z) => {
    valvesGroup.add(makeCylinder([-0.035, 0.29, z], 0.007, 0.08, 0xd0a23a, { metalness: 0.6, roughness: 0.3 }));
    valvesGroup.add(makeCylinder([0.035, 0.29, z], 0.007, 0.08, 0xd0a23a, { metalness: 0.6, roughness: 0.3 }));
  });
  defs.push({
    id: "kleppen",
    name: "Kleppen & klepveren",
    order: 11,
    color: 0xd0a23a,
    mesh: valvesGroup,
    explodeOffset: [0, 0.85, -0.5],
    info: {
      functie:
        "De kleppen laten op het juiste moment lucht/brandstofmengsel in en uitlaatgassen uit; de klepveren houden ze gesloten tegen de verbrandingsdruk in en zorgen dat ze de nokkenas blijven volgen.",
      volgorde:
        "In de cilinderkop gemonteerd vóórdat deze op het blok geplaatst wordt.",
      fouten:
        "Een gebroken of verzwakte klepveer niet herkennen bij een revisie — geeft bij hoog toerental 'klepzweven' (valve float), waarbij de klep de nokkenas niet meer kan volgen, met motorschade tot gevolg.",
    },
  });

  const rockersGroup = new THREE.Group();
  CYLINDER_Z.forEach((z) => {
    rockersGroup.add(makeLink([-0.035, 0.33, z], [0, 0.36, z], 0.01, 0x707070));
    rockersGroup.add(makeLink([0.035, 0.33, z], [0, 0.36, z], 0.01, 0x707070));
  });
  defs.push({
    id: "tuimelaars",
    name: "Tuimelaars",
    order: 12,
    color: 0x707070,
    mesh: rockersGroup,
    explodeOffset: [0, 0.8, 0.2],
    info: {
      functie:
        "Brengen de beweging van de nokkenas over op de kleppen. De M40 heeft hydraulische klepstoters, die automatisch de klepspeling op nul houden — handmatig afstellen is bij deze motor dus niet nodig.",
      volgorde:
        "Tussen nokkenas en kleppen gemonteerd, als onderdeel van de cilinderkop-opbouw.",
      fouten:
        "Bij een net gereviseerde motor meteen verwachten dat de hydraulische stoters stil zijn — ze hebben vaak een korte tijd (soms een paar honderd kilometer) nodig om zich met olie te vullen en het tikgeluid kwijt te raken. Voortijdig gaan sleutelen aan 'foute' klepspeling is dan een misvatting: die is bij deze motor niet handmatig instelbaar.",
    },
  });

  defs.push({
    id: "kleppendeksel",
    name: "Kleppendeksel",
    order: 13,
    color: 0x20242c,
    mesh: makeBox([0, 0.44, 0], [0.38, 0.07, 0.48], 0x20242c),
    explodeOffset: [0, 0.7, -0.6],
    info: {
      functie:
        "Sluit de bovenkant van de cilinderkop af en houdt de olie bij de klep- en nokkenasbediening binnen de motor.",
      volgorde:
        "Als een van de laatste stappen bovenop de gemonteerde cilinderkop geplaatst.",
      fouten:
        "De kleppendekselpakking te vast aandraaien — kan de dunne pakking of het deksel zelf vervormen, een klassieke oorzaak van hardnekkige olielekkages bij BMW-motoren.",
    },
  });

  // --- Distributie & hulpstukken aan de voorkant -----------------------------

  const crankGear = [0, -0.07, 0.27];
  const camGear = [0, 0.28, 0.27];
  const timingGroup = new THREE.Group();
  timingGroup.add(makeCylinder(crankGear, 0.055, 0.03, 0x2f3644, { axis: "z" }));
  timingGroup.add(makeCylinder(camGear, 0.065, 0.03, 0x2f3644, { axis: "z" }));
  timingGroup.add(makeLink([crankGear[0] - 0.055, crankGear[1], crankGear[2]], [camGear[0] - 0.065, camGear[1], camGear[2]], 0.008, 0x707070));
  timingGroup.add(makeLink([crankGear[0] + 0.055, crankGear[1], crankGear[2]], [camGear[0] + 0.065, camGear[1], camGear[2]], 0.008, 0x707070));
  defs.push({
    id: "distributieriem",
    name: "Distributieriem",
    order: 14,
    color: 0x2f3644,
    mesh: timingGroup,
    explodeOffset: [0, 0.2, 0.9],
    info: {
      functie:
        "Houdt de rotatie van de krukas en de nokkenas — en daarmee de klepbediening — synchroon met de zuigerbeweging. De M40B18 gebruikt hiervoor een tandriem; pas de latere M50TU-zescilinders e.v. gingen over op een ketting.",
      volgorde:
        "Gemonteerd nadat kop en blok met elkaar verbonden zijn, met de kruk- en nokkenastandwielen exact op hun merktekens uitgelijnd.",
      fouten:
        "De M40 is een 'interference engine': als de riem springt of afwijkt van zijn merktekens, raken de kleppen de zuigers en is de schade direct. Preventief vervangen ruim binnen het voorgeschreven interval is bij deze motor geen overbodige luxe, zeker niet als de vervangingsgeschiedenis onbekend is.",
    },
  });

  const waterPumpCenter = [0, -0.02, 0.32];
  defs.push({
    id: "waterpomp",
    name: "Waterpomp",
    order: 15,
    color: 0x6e7889,
    mesh: makeCylinder(waterPumpCenter, 0.07, 0.09, 0x6e7889, { axis: "z", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, 0, 0.4],
    info: {
      functie:
        "Pompt koelvloeistof door blok, cilinderkop en radiateur om de motor op bedrijfstemperatuur te houden.",
      volgorde:
        "Aan de voorkant van het blok gemonteerd; bij de M40 wordt de pomp mee aangedreven door de distributieriem.",
      fouten:
        "Een waterpomp met een lekkende as-afdichting laten zitten 'omdat hij nog niet echt lekt' — de inwendige lagers kunnen zonder duidelijke waarschuwing verslijten, tot de pomp plotseling vastloopt en de distributieriem beschadigt. Bij vervanging van de riem wordt de waterpomp om die reden vaak in één moeite mee vervangen.",
    },
  });

  const pulleyCenter = [0, -0.07, 0.37];
  const pulleyGroup = new THREE.Group();
  pulleyGroup.add(makeCylinder(pulleyCenter, 0.095, 0.05, 0x394452, { axis: "z", metalness: 0.6 }));
  defs.push({
    id: "krukaspoelie",
    name: "Krukaspoelie + accessoireriem",
    order: 16,
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

  const alternatorCenter = [0.2, 0.08, 0.3];
  defs.push({
    id: "alternator",
    name: "Alternator",
    order: 17,
    color: 0x707070,
    mesh: makeCylinder(alternatorCenter, 0.06, 0.1, 0x707070, { axis: "z", metalness: 0.55, roughness: 0.4 }),
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

  const starterCenter = [0.18, -0.16, -0.28];
  defs.push({
    id: "startmotor",
    name: "Startmotor",
    order: 18,
    color: 0x394452,
    mesh: makeCylinder(starterCenter, 0.055, 0.14, 0x394452, { axis: "x", metalness: 0.5, roughness: 0.4 }),
    explodeOffset: [0.5, -0.4, -0.9],
    info: {
      functie:
        "Laat, aangedreven door de accu, de motor initieel ronddraaien om hem te starten — via een tandwiel dat inkoppelt op de vertanding van het vliegwiel.",
      volgorde:
        "Aan de onderkant van het blok/de versnellingsbak gemonteerd, met de elektrische aansluiting als laatste stap.",
      fouten:
        "Een versleten vertanding op het vliegwiel negeren — geeft een knarsend geluid bij het starten en kan uiteindelijk zowel vliegwiel als startmotor beschadigen.",
    },
  });

  // --- Ontsteking -----------------------------------------------------------

  const distributorCenter = [0.15, 0.4, -0.2];
  const distributorGroup = new THREE.Group();
  distributorGroup.add(makeCylinder(distributorCenter, 0.035, 0.08, 0xd0a23a, { axis: "y", metalness: 0.4 }));
  distributorGroup.add(makeSphere([distributorCenter[0], distributorCenter[1] + 0.05, distributorCenter[2]], 0.035, 0x2f3644, { roughness: 0.5 }));
  defs.push({
    id: "verdeler",
    name: "Verdeler",
    order: 19,
    color: 0xd0a23a,
    mesh: distributorGroup,
    explodeOffset: [0.5, 0.6, -0.5],
    info: {
      functie:
        "Verdeelt, aangedreven vanaf de nokkenas, de hoogspanning van de bobine op het juiste moment naar de juiste bougie — de kern van het (bij deze motor nog conventionele) verdelergestuurde ontstekingssysteem.",
      volgorde:
        "Op de cilinderkop gemonteerd en op de juiste ontstekingsvolgorde afgesteld, nadat nokkenas en distributie gemonteerd zijn.",
      fouten:
        "De verdelerkap verkeerd terugplaatsen na onderhoud, of de pen/aandrijving laten verslijten — de motor slaat dan aan op de verkeerde cilinder, met een grove, onregelmatige loop tot gevolg.",
    },
  });

  const coilCenter = [-0.32, 0.18, -0.12];
  defs.push({
    id: "bobine",
    name: "Bobine",
    order: 20,
    color: 0xd0a23a,
    mesh: makeBox(coilCenter, [0.06, 0.1, 0.05], 0xd0a23a, { metalness: 0.3 }),
    explodeOffset: [-0.7, 0.4, -0.4],
    info: {
      functie:
        "Zet de lage boordspanning om in de hoge spanning die nodig is om bij de bougie een vonk te laten overspringen.",
      volgorde:
        "Los van de verdeler gemonteerd, met een hoogspanningskabel naar de verdelerkap.",
      fouten:
        "Een verzwakte bobine (minder vonkspanning) niet als eerste verdenken bij een startprobleem of haperen bij hoog toerental — dit wordt vaak ten onrechte eerst bij de bougies of de verdeler gezocht.",
    },
  });

  const sparkPlugsGroup = new THREE.Group();
  CYLINDER_Z.forEach((z) => {
    sparkPlugsGroup.add(makeCylinder([0, 0.37, z], 0.009, 0.07, 0xd0a23a, { metalness: 0.5, roughness: 0.35 }));
  });
  defs.push({
    id: "bougies",
    name: "Bougies",
    order: 21,
    color: 0xd0a23a,
    mesh: sparkPlugsGroup,
    explodeOffset: [0, 0.9, -0.7],
    info: {
      functie:
        "Laten op het juiste moment een vonk overspringen die het lucht/brandstofmengsel in de cilinder ontsteekt.",
      volgorde:
        "Als laatste in de cilinderkop geschroefd, met de bougiekabels vanaf de verdelerkap erop aangesloten.",
      fouten:
        "De bougies met een verkeerde elektrodenafstand (gap) monteren, of te vast aandraaien — te vast kan de schroefdraad in de (aluminium) cilinderkop beschadigen.",
    },
  });

  // --- Inlaattraject ----------------------------------------------------------

  const airboxCenter = [-0.55, 0.32, -0.15];
  defs.push({
    id: "luchtfilterhuis",
    name: "Luchtfilterhuis",
    order: 22,
    color: 0x9aa4b5,
    mesh: makeBox(airboxCenter, [0.18, 0.12, 0.22], 0x9aa4b5, { metalness: 0.2, roughness: 0.6 }),
    explodeOffset: [-1.0, 0.2, -0.3],
    info: {
      functie:
        "Houdt vuil en stof uit de aangezogen lucht voordat deze het gasklephuis en de cilinders bereikt.",
      volgorde:
        "Vóór het gasklephuis gemonteerd, als eerste stap van het inlaattraject.",
      fouten:
        "Een sportluchtfilter of open filter monteren zonder de effecten op de luchtmassameting mee te wegen — kan bij deze oudere Motronic-generatie een merkbaar onzuiverder mengsel geven.",
    },
  });

  const throttleBodyCenter = [-0.42, 0.3, 0];
  defs.push({
    id: "gasklephuis",
    name: "Gasklephuis",
    order: 23,
    color: 0xb5bdc9,
    mesh: makeCylinder(throttleBodyCenter, 0.045, 0.08, 0xb5bdc9, { axis: "x", metalness: 0.5, roughness: 0.35 }),
    explodeOffset: [-0.7, 0.3, 0.3],
    info: {
      functie:
        "Regelt, via de gaskabel vanaf het pedaal, hoeveel lucht de motor binnenkomt — direct mechanisch verbonden met het gaspedaal, niet elektronisch (drive-by-wire) zoals bij latere motoren.",
      volgorde:
        "Tussen luchtfilterhuis en inlaatspruitstuk gemonteerd.",
      fouten:
        "De gaskabel te strak afstellen, waardoor de gasklep nooit helemaal dichtvalt — geeft een te hoog, onstabiel stationair toerental.",
    },
  });

  defs.push({
    id: "inlaatspruitstuk",
    name: "Inlaatspruitstuk",
    order: 24,
    color: 0xb5bdc9,
    mesh: makeBox([-0.3, 0.28, 0], [0.13, 0.13, 0.42], 0xb5bdc9, { metalness: 0.4, roughness: 0.4 }),
    explodeOffset: [-0.8, 0.1, 0],
    info: {
      functie:
        "Verdeelt de aangezogen lucht gelijkmatig over de vier cilinders, vlak vóór de injectoren of inlaatkleppen.",
      volgorde:
        "Op de cilinderkop gemonteerd nadat deze zelf op het blok zit.",
      fouten:
        "Inlaatpakkingen en -rubbers niet goed laten aansluiten — een klein valse-luchtlek hier verstoort de luchtmengselberekening van de motorcomputer merkbaar, met een onrustig stationair toerental als gevolg.",
    },
  });

  defs.push({
    id: "uitlaatspruitstuk",
    name: "Uitlaatspruitstuk",
    order: 25,
    color: 0x707070,
    mesh: makeCurvedTube(
      [
        [0.28, 0.22, -0.18],
        [0.34, 0.12, -0.02],
        [0.32, 0.02, 0.14],
        [0.24, -0.02, 0.24],
      ],
      0.032,
      0x707070,
      { metalness: 0.6, roughness: 0.4 }
    ),
    explodeOffset: [0.8, -0.2, 0.3],
    info: {
      functie:
        "Voert de verbrande gassen van de vier cilinders samen (een klassiek 4-in-1-spruitstuk) naar het uitlaatsysteem. De vorm en lengte van de runners beïnvloedt merkbaar het koppel- en vermogenskarakter van de motor.",
      volgorde:
        "Op de cilinderkop gemonteerd, meestal aan de tegenoverliggende kant van het inlaatspruitstuk.",
      fouten:
        "Uitlaatbouten of -moeren op een nog warme motor los- of vastdraaien zonder te laten afkoelen — verhoogt sterk het risico op afgebroken, vastgeroeste bevestigingen.",
    },
  });

  // --- Motormanagement & steunen -----------------------------------------------

  const dmeCenter = [0.68, 0.45, -0.35];
  const dmeGroup = new THREE.Group();
  dmeGroup.add(makeBox(dmeCenter, [0.16, 0.1, 0.22], 0x2f3644, { metalness: 0.3, roughness: 0.5 }));
  dmeGroup.add(makeLink(dmeCenter, [alternatorCenter[0] + 0.1, alternatorCenter[1] + 0.05, alternatorCenter[2]], 0.008, 0x707070));
  defs.push({
    id: "motorcomputer",
    name: "Motorcomputer (DME)",
    order: 26,
    color: 0x2f3644,
    mesh: dmeGroup,
    explodeOffset: [0.4, 0.4, -0.3],
    info: {
      functie:
        "Verzamelt signalen van sensoren (koelvloeistoftemperatuur, luchtmassa, gaspositie, lambdasonde) en stuurt op basis daarvan ontstekingstiming en brandstofinjectie aan — het 'brein' van de Bosch Motronic op deze motor.",
      volgorde:
        "Los van de motor gemonteerd (in de E36 typisch rechts in het motorcompartiment), met de kabelboom als laatste aangesloten.",
      fouten:
        "Bij een motorswap de niet-matchende DME-software of -hardware van de oude motor laten zitten — een veelgemaakte valkuil bij zescilinder-swaps in de E36 drift-scene, die daarom vaak een complete kabelboom + DME uit de donorauto meenemen in plaats van losse onderdelen te mixen.",
    },
  });

  defs.push({
    id: "motorsteunen",
    name: "Motorsteunen",
    order: 27,
    color: 0x2f3644,
    mesh: (() => {
      const group = new THREE.Group();
      group.add(makeLink([-0.24, -0.18, -0.08], [-0.44, -0.5, -0.08], 0.032, 0x2f3644));
      group.add(makeLink([0.24, -0.18, -0.08], [0.44, -0.5, -0.08], 0.032, 0x2f3644));
      return group;
    })(),
    explodeOffset: [0, -0.9, -0.4],
    info: {
      functie:
        "Dragen het gewicht van de motor en isoleren trillingen richting de carrosserie, terwijl ze de motor stevig op zijn plek houden — ook onder wisselend koppel tijdens het driften.",
      volgorde:
        "Als eerste gemonteerd (op blok en carrosserie/subframe), vóórdat de motor definitief op zijn plek hangt.",
      fouten:
        "Verharde of gescheurde rubberen motorsteunen laten zitten. Dat geeft extra motorbeweging onder belasting, wat bij een drift-build met veel koppelwisselingen (clutch kicks, gasstoten) versneld tot kabel- of leidingbreuk kan leiden — en bij een toekomstige zwaardere motor (zie hierboven) is dit sowieso een van de eerste onderdelen om te herzien.",
    },
  });

  return defs;
}
