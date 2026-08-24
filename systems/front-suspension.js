// Schematische geometrie + kennisdata voor de linker voorwielophanging van een BMW E36.
//
// Coordinatensysteem (meters, bij benadering):
//   x = 0  -> hart van het wiel (buitenkant, wielzijde)
//   x > 0  -> naar binnen, richting het midden van de auto (subframe/chassis)
//   y = 0  -> hoogte van het wielcentrum (naafhoogte)
//   y > 0  -> omhoog
//   z = 0  -> denkbeeldige dwarslijn door het wielcentrum
//   z > 0  -> naar voren van de auto

import * as THREE from "three";
import { makeLink, makeBox, makeCylinder, makeSphere, makeCoilSpring, material } from "./helpers.js";

export const meta = {
  id: "voorwielophanging",
  name: "Voorwielophanging",
  short: "Voor",
  description:
    "De linker voorwielophanging (McPherson-veerpoot): draagarm, kogelgewricht, schokdemper, veer en stuurkoppeling.",
  cameraPosition: [3.6, 2.2, 3.3],
  cameraTarget: [0.5, -0.1, 0],
};

export function createParts() {
  const defs = [];

  defs.push({
    id: "subframe",
    name: "Subframe (hulpframe)",
    order: 1,
    color: 0x4a5568,
    mesh: makeBox([0.95, -0.5, 0], [0.18, 0.14, 1.15], 0x4a5568),
    explodeOffset: [0.9, 0, 0],
    info: {
      functie:
        "Het subframe is het frame dat de complete voorwielophanging (draagarmen, stabilisatorstang, motorsteunen) aan de carrosserie bevestigt. Het neemt alle krachten uit de ophanging op voordat ze in het koetswerk gaan.",
      volgorde:
        "Wordt als eerste (opnieuw) vastgezet aan de carrosserie, vóórdat er ophangingsonderdelen aan gehangen worden.",
      fouten:
        "Subframebouten niet met het juiste aandraaimoment vastzetten. Scheuren in het subframe (een bekend E36-probleem, vooral bij M3's) over het hoofd zien bij inspectie of montage.",
    },
  });

  const ballJointPos = [0, -0.38, 0.02];
  const armFrontPivot = [0.85, -0.42, 0.32];
  const armRearPivot = [0.85, -0.42, -0.28];
  const armGroup = new THREE.Group();
  armGroup.add(makeLink(ballJointPos, armFrontPivot, 0.035, 0x5a6472));
  armGroup.add(makeLink(ballJointPos, armRearPivot, 0.035, 0x5a6472));
  armGroup.add(makeLink(armFrontPivot, armRearPivot, 0.02, 0x4a5460));
  defs.push({
    id: "draagarm",
    name: "Draagarm (onderste draagarm)",
    order: 2,
    color: 0x5a6472,
    mesh: armGroup,
    explodeOffset: [0.3, -0.9, 0],
    info: {
      functie:
        "Verbindt de fusee (wielophanging) met het subframe en bepaalt samen met de kogelgewrichten en rubbers de wielgeometrie (camber, caster). Neemt zijdelingse en lengtekrachten op.",
      volgorde:
        "Wordt op het subframe gemonteerd via twee rubberlagers (bushings), vóórdat de fusee wordt aangesloten.",
      fouten:
        "Bevestigingsbouten van de draagarmrubbers vastzetten terwijl de auto nog op de lift staat — dit moet met de wielen belast (auto op de grond) gebeuren, anders slijten de rubbers voortijdig door verkeerde voorspanning.",
    },
  });

  defs.push({
    id: "kogelgewricht",
    name: "Kogelgewricht",
    order: 3,
    color: 0xd0a23a,
    mesh: makeSphere(ballJointPos, 0.055, 0xd0a23a, { metalness: 0.7, roughness: 0.3 }),
    explodeOffset: [-0.35, -0.25, 0.2],
    info: {
      functie:
        "Vormt het draaipunt tussen de draagarm en de fusee, en laat de wielophanging op en neer bewegen én sturen. Werkt als een kogelscharnier in alle richtingen.",
      volgorde:
        "Wordt na (of samen met) de draagarm gemonteerd, vóórdat de fusee wordt aangesloten.",
      fouten:
        "Speling niet controleren vóór (her)montage. Kogelgewricht droog of met te weinig vet monteren. Stofhoes beschadigen bij montage, waardoor vuil en water erin komen en het gewricht snel versleten raakt.",
    },
  });

  const swayBarNear = [0.85, -0.58, -0.22];
  const swayBarFar = [2.05, -0.58, -0.22];
  const swayLinkArm = [0.32, -0.42, -0.05];
  const swayGroup = new THREE.Group();
  swayGroup.add(makeLink(swayBarNear, swayBarFar, 0.028, 0x394452));
  swayGroup.add(makeLink(swayBarNear, swayLinkArm, 0.02, 0x6b7688));
  defs.push({
    id: "stabilisatorstang",
    name: "Stabilisatorstang + koppelstang",
    order: 4,
    color: 0x394452,
    mesh: swayGroup,
    explodeOffset: [0.1, -0.7, -0.6],
    info: {
      functie:
        "De stabilisatorstang (anti-rollbar) verbindt links en rechts met elkaar en vermindert het overhellen van de auto in bochten. De koppelstang (link) verbindt de stabilisatorstang met de draagarm.",
      volgorde:
        "Wordt op het subframe gemonteerd (via rubberklemmen) en daarna met de koppelstang aan de draagarm bevestigd, nadat de draagarm al vastzit.",
      fouten:
        "Rubbers van de stang verkeerd om of te strak/los monteren, wat klapper- en piepgeluiden geeft. Versleten koppelstangen met speling laten zitten, wat het stuurgedrag bij een drift-build merkbaar minder voorspelbaar maakt.",
    },
  });

  const hubPoint = [0, 0, 0];
  const fuseeGroup = new THREE.Group();
  fuseeGroup.add(makeBox([0.02, 0.02, 0], [0.16, 0.7, 0.16], 0x6e7889));
  fuseeGroup.add(makeCylinder(hubPoint, 0.085, 0.16, 0x8a94a3, { axis: "x", metalness: 0.7, roughness: 0.25 }));
  defs.push({
    id: "fusee",
    name: "Fusee & wiellager",
    order: 5,
    color: 0x6e7889,
    mesh: fuseeGroup,
    explodeOffset: [-0.75, 0.15, 0.1],
    info: {
      functie:
        "De fusee (ook wel wielophanging of stuurknokkel) draagt het wiellager en de remschijf, en verbindt de draagarm onderaan met de schokdemper bovenaan. Het wiellager laat het wiel vrij ronddraaien.",
      volgorde:
        "Wordt onderaan op het kogelgewricht gemonteerd en bovenaan geklemd op de schokdemper, vóórdat schokdemper/veer als geheel definitief vastgezet worden.",
      fouten:
        "Het wiellager scheef in de fusee persen, waardoor de lagerbaan beschadigd raakt. De wielnaafmoer niet met het juiste aandraaimoment vastzetten (te los geeft speling, te vast overbelast het lager).",
    },
  });

  const strutBottom = [0, 0.32, -0.01];
  const strutTop = [0.03, 0.78, -0.06];
  defs.push({
    id: "schokdemper",
    name: "Schokdemper (veerpoot)",
    order: 6,
    color: 0x8a94a3,
    mesh: makeLink(strutBottom, strutTop, 0.05, 0x8a94a3, { metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [-0.2, 0.9, 0.35],
    info: {
      functie:
        "Dempt de bewegingen van de veer en houdt daarmee het wielcontact met de weg onder controle. Bij een McPherson-veerpoot (zoals de E36) draagt de demper ook een deel van de sturingsgeometrie.",
      volgorde:
        "Wordt meestal als complete eenheid (demper + veer + toren) voorgemonteerd en dan onderaan op de fusee geklemd, en bovenaan aan de veerpoottoren bevestigd.",
      fouten:
        "Een veerspanner onveilig of verkeerd gebruiken bij het los- of vastzetten van de veer — dit is een van de gevaarlijkste momenten bij sleutelen aan de ophanging. De demper ondersteboven of verkeerd om monteren.",
    },
  });

  defs.push({
    id: "veer",
    name: "Veer",
    order: 7,
    color: 0x3ba76b,
    mesh: makeCoilSpring([0.015, 0.62, -0.035], 0.12, 0.014, 0.5, 5.5, 0x3ba76b),
    explodeOffset: [0.5, 0.5, 0.55],
    info: {
      functie:
        "Draagt het gewicht van de auto en absorbeert oneffenheden in het wegdek. De veerstijfheid en -hoogte bepalen mede rijhoogte, camber en het gedrag van de auto tijdens het driften.",
      volgorde:
        "Wordt samen met de schokdemper voorgemonteerd (samengedrukt met een veerspanner) tot een complete veerpoot, vóórdat deze als geheel in de auto gaat.",
      fouten:
        "Een verlaagde of stijvere veer kiezen zonder de rest van de geometrie (camber, bump steer) mee te herzien. De veer niet goed in de veerschotel laten zitten, waardoor hij bij montage kan wegschieten.",
    },
  });

  const topMountPoint = strutTop;
  defs.push({
    id: "veerpootlager",
    name: "Veerpootlager (top mount)",
    order: 8,
    color: 0x2f3644,
    mesh: makeCylinder(
      [topMountPoint[0], topMountPoint[1] + 0.02, topMountPoint[2]],
      0.09,
      0.05,
      0x2f3644,
      { axis: "x" }
    ),
    explodeOffset: [0.15, 0.7, -0.3],
    info: {
      functie:
        "Bevestigt de bovenkant van de veerpoot aan de carrosserie (veerpoottoren) en laat de veerpoot tegelijk meedraaien met de stuurbeweging via een ingebouwd lager.",
      volgorde:
        "Sluit de veerpoot-montage af: wordt bovenop de veer/schokdemper geplaatst en met de toren-moeren vastgezet nadat de veerpoot in de auto hangt.",
      fouten:
        "Een versleten of vastzittend veerpootlager hergebruiken in plaats van vervangen — hierdoor voelt het stuur zwaar aan of hoor je geknars bij het insturen.",
    },
  });

  const steeringArmPoint = [0, -0.02, 0.24];
  const rackPoint = [0.95, -0.08, 0.4];
  defs.push({
    id: "spoorstang",
    name: "Spoorstang / stuurkogel",
    order: 9,
    color: 0xb5bdc9,
    mesh: makeLink(steeringArmPoint, rackPoint, 0.022, 0xb5bdc9, { metalness: 0.6, roughness: 0.3 }),
    explodeOffset: [0.1, -0.3, 0.85],
    info: {
      functie:
        "Verbindt de stuurstang met de fusee en zet de beweging van het stuur om in het draaien van het wiel. Bepaalt mede het spoor (toe) van het voorwiel.",
      volgorde:
        "Wordt aangesloten nadat de fusee aan de draagarm en schokdemper vastzit, zodat de wielophanging al zijn definitieve positie kan aannemen.",
      fouten:
        "De kroonmoer op de stuurkogel niet borgen met een splitpen. Na vervanging het spoor (toe) niet opnieuw laten instellen — cruciaal voor stabiel rijgedrag, zeker bij een drift-build.",
    },
  });

  defs.push({
    id: "remschijf",
    name: "Remschijf",
    order: 10,
    color: 0x707070,
    mesh: makeCylinder([0.055, 0, 0], 0.29, 0.028, 0x707070, {
      axis: "x",
      metalness: 0.55,
      roughness: 0.5,
      segments: 32,
    }),
    explodeOffset: [-0.45, 0, 0],
    info: {
      functie:
        "Het roterende deel van de remschijfrem waar de remblokken tegenaan knijpen om de auto af te remmen via wrijving. Zit direct op het wiellager/de naaf.",
      volgorde:
        "Wordt over de naafbouten geschoven nadat de fusee/het wiellager op zijn plek zit, vóórdat de remklauw erover geplaatst wordt.",
      fouten:
        "Een nieuwe schijf monteren op een vervuild of roestig naafvlak, wat trilling (pulsatie) bij het remmen veroorzaakt. De anti-corrosielaag op het remvlak van een nieuwe schijf niet verwijderen.",
    },
  });

  defs.push({
    id: "remklauw",
    name: "Remklauw",
    order: 11,
    color: 0xc73b3b,
    mesh: makeBox([0.06, 0.24, 0.03], [0.14, 0.2, 0.28], 0xc73b3b),
    explodeOffset: [0, 0.15, 0.75],
    info: {
      functie:
        "Knijpt de remblokken tegen de remschijf met behulp van hydraulische druk uit het remsysteem, en levert daarmee de remkracht op het wiel.",
      volgorde:
        "Wordt als laatste van het remsysteem over de remschijf gemonteerd en aan de fusee vastgebout, nadat de schijf al op zijn plek zit.",
      fouten:
        "De remslang laten verdraaien bij montage, wat op termijn tot lekkage of een vastlopende rem leidt. Remklauwbouten niet op moment aandraaien. Na montage vergeten te ontluchten, waardoor het rempedaal 'sponzig' aanvoelt.",
    },
  });

  defs.push({
    id: "wiel",
    name: "Wiel (velg + band)",
    order: 12,
    color: 0x20242c,
    mesh: (() => {
      const group = new THREE.Group();
      const tire = makeCylinder([0, 0, 0], 0.34, 0.22, 0x20242c, {
        axis: "x",
        metalness: 0.1,
        roughness: 0.9,
        transparent: true,
        opacity: 0.55,
      });
      const rim = makeCylinder([0, 0, 0], 0.19, 0.22, 0x9aa4b5, {
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
        "Het wiel (velg + band) is het contactpunt met de weg. Het maakt strikt genomen geen deel uit van het ophangingssysteem, maar wordt hier getoond voor context — en moet er als eerste af bij het sleutelen aan de ophanging.",
      volgorde:
        "Wordt in de praktijk als éérste gedemonteerd (voordat je bij de ophanging kunt) en pas als láátste weer gemonteerd, na afloop van alle andere werkzaamheden.",
      fouten:
        "Wielmoeren niet kruislings en niet op het juiste aandraaimoment vastzetten, wat tot een scheef zittend wiel of losraken kan leiden.",
    },
  });

  return defs;
}
