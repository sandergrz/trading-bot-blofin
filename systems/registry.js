import * as frontSuspension from "./front-suspension.js";
import * as rearSuspension from "./rear-suspension.js";
import * as brakes from "./brakes.js";
import * as steering from "./steering.js";
import * as engine from "./engine.js";
import * as vanos from "./vanos.js";
import * as cooling from "./cooling.js";
import * as gearboxClutch from "./gearbox-clutch.js";
import * as differential from "./differential.js";
import * as exhaust from "./exhaust.js";
import * as fuel from "./fuel.js";

// Volgorde bepaalt de volgorde van de tabs in de UI.
export const SYSTEMS = [
  frontSuspension,
  rearSuspension,
  brakes,
  steering,
  engine,
  vanos,
  cooling,
  gearboxClutch,
  differential,
  exhaust,
  fuel,
];
