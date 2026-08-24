import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SYSTEMS } from "./systems/registry.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x14171c);
scene.fog = new THREE.Fog(0x14171c, 6, 14);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.3;
controls.maxDistance = 10;

scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(3, 5, 2);
scene.add(key);
const fill = new THREE.DirectionalLight(0x88aaff, 0.35);
fill.position.set(-3, 2, -3);
scene.add(fill);

const grid = new THREE.GridHelper(6, 24, 0x2d3340, 0x22262f);
grid.position.y = -1.05;
scene.add(grid);

// --- DOM-referenties -------------------------------------------------------

const systemTabsEl = document.getElementById("system-tabs");
const systemDescriptionEl = document.getElementById("system-description");
const partsListEl = document.getElementById("parts-list");
const partsListTitleEl = document.getElementById("parts-list-title");

const infoEmpty = document.getElementById("info-empty");
const infoContent = document.getElementById("info-content");
const infoOrder = document.getElementById("info-order");
const infoName = document.getElementById("info-name");
const infoFunction = document.getElementById("info-function");
const infoSequence = document.getElementById("info-sequence");
const infoMistakes = document.getElementById("info-mistakes");
const btnTogglePart = document.getElementById("btn-toggle-part");
const rangeInput = document.getElementById("explode-range");

// --- State per geladen systeem ----------------------------------------------

let parts = [];
let partsById = {};
let selectedId = null;
const originalEmissive = new Map();
let currentSystemId = null;

function disposeObject3D(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    child.geometry.dispose();
    if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
    else child.material.dispose();
  });
}

function clearCurrentSystem() {
  parts.forEach((part) => {
    scene.remove(part.mesh);
    disposeObject3D(part.mesh);
  });
  parts = [];
  partsById = {};
  selectedId = null;
  originalEmissive.clear();
  partsListEl.innerHTML = "";
  infoEmpty.classList.remove("hidden");
  infoContent.classList.add("hidden");
  rangeInput.value = 0;
}

function loadSystem(systemModule) {
  clearCurrentSystem();
  currentSystemId = systemModule.meta.id;

  const defs = systemModule.createParts();
  parts = defs.map((def) => {
    const mesh = def.mesh;
    mesh.userData.partId = def.id;
    mesh.traverse((child) => {
      if (child.isMesh) child.userData.partId = def.id;
    });
    scene.add(mesh);

    const assembledPosition = mesh.position.clone();
    const explodeOffset = new THREE.Vector3(...def.explodeOffset);
    const explodedPosition = assembledPosition.clone().add(explodeOffset);

    return {
      ...def,
      mesh,
      assembledPosition,
      explodedPosition,
      t: 0,
      tween: null,
    };
  });
  partsById = Object.fromEntries(parts.map((p) => [p.id, p]));
  parts.forEach((p) => {
    p.mesh.traverse((child) => {
      if (child.isMesh) originalEmissive.set(child, child.material.emissive.clone());
    });
  });

  buildPartsList();
  systemDescriptionEl.textContent = systemModule.meta.description;
  partsListTitleEl.textContent = `${systemModule.meta.name} — onderdelen (montagevolgorde)`;

  const camPos = systemModule.meta.cameraPosition ?? [2.6, 1.6, 2.4];
  const camTarget = systemModule.meta.cameraTarget ?? [0, 0, 0];
  camera.position.set(...camPos);
  controls.target.set(...camTarget);
  controls.update();

  updateTabsActive();
}

// --- Tabs --------------------------------------------------------------------

SYSTEMS.forEach((systemModule) => {
  const btn = document.createElement("button");
  btn.className = "system-tab";
  btn.textContent = systemModule.meta.short;
  btn.title = systemModule.meta.name;
  btn.dataset.systemId = systemModule.meta.id;
  btn.addEventListener("click", () => loadSystem(systemModule));
  systemTabsEl.appendChild(btn);
});

function updateTabsActive() {
  [...systemTabsEl.children].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.systemId === currentSystemId);
  });
}

// --- Onderdelenlijst -----------------------------------------------------------

function buildPartsList() {
  const sorted = [...parts].sort((a, b) => a.order - b.order);
  sorted.forEach((part) => {
    const li = document.createElement("li");
    li.className = "parts-list-item";
    li.dataset.partId = part.id;
    li.innerHTML = `
      <span class="order-num">${part.order}</span>
      <span class="swatch" style="background:#${part.color.toString(16).padStart(6, "0")}"></span>
      <span class="label">${part.name}</span>
      <span class="state" data-state></span>
    `;
    li.addEventListener("click", () => selectPart(part.id));
    partsListEl.appendChild(li);
  });
}

function refreshPartsListState() {
  parts.forEach((part) => {
    const li = partsListEl.querySelector(`[data-part-id="${part.id}"]`);
    if (!li) return;
    li.classList.toggle("active", part.id === selectedId);
    const stateEl = li.querySelector("[data-state]");
    stateEl.textContent = part.t > 0.5 ? "los" : "vast";
  });
}

// --- Selectie & infopaneel ------------------------------------------------

function setHighlight(part, on) {
  part.mesh.traverse((child) => {
    if (!child.isMesh) return;
    const base = originalEmissive.get(child);
    child.material.emissive.copy(on ? new THREE.Color(0x4fa8ff) : base);
    child.material.emissiveIntensity = on ? 0.55 : 1;
  });
}

function selectPart(id) {
  if (selectedId && partsById[selectedId]) setHighlight(partsById[selectedId], false);
  selectedId = id;
  const part = partsById[id];
  setHighlight(part, true);

  infoEmpty.classList.add("hidden");
  infoContent.classList.remove("hidden");
  infoOrder.textContent = `Montagevolgorde: stap ${part.order} van ${parts.length}`;
  infoName.textContent = part.name;
  infoFunction.textContent = part.info.functie;
  infoSequence.textContent = part.info.volgorde;
  infoMistakes.textContent = part.info.fouten;
  updateToggleButton();
  refreshPartsListState();
}

function updateToggleButton() {
  if (!selectedId) return;
  const part = partsById[selectedId];
  const isApart = part.t > 0.5;
  btnTogglePart.textContent = isApart ? "Monteer dit onderdeel" : "Demonteer dit onderdeel";
}

btnTogglePart.addEventListener("click", () => {
  if (!selectedId) return;
  const part = partsById[selectedId];
  const goingApart = part.t <= 0.5;
  startTween(part, goingApart ? 1 : 0, 0, 500);
  setTimeout(updateToggleButton, 520);
});

// --- Raycasting / klikken op 3D-onderdelen --------------------------------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener("click", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  const hit = hits.find((h) => h.object.userData.partId);
  if (hit) selectPart(hit.object.userData.partId);
});

// --- Tween / animatie-engine ----------------------------------------------

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function startTween(part, toT, delay, duration) {
  part.tween = {
    fromT: part.t,
    toT,
    start: performance.now() + delay,
    duration,
  };
}

function stopAllTweens() {
  parts.forEach((p) => (p.tween = null));
}

function applyT(part, t) {
  part.t = t;
  part.mesh.position.lerpVectors(part.assembledPosition, part.explodedPosition, t);
}

function tickTweens(now) {
  parts.forEach((part) => {
    const tw = part.tween;
    if (!tw) return;
    if (now < tw.start) return;
    const elapsed = now - tw.start;
    const progress = Math.min(elapsed / tw.duration, 1);
    const eased = easeInOutCubic(progress);
    applyT(part, tw.fromT + (tw.toT - tw.fromT) * eased);
    if (progress >= 1) part.tween = null;
  });
}

// --- Globale montage/demontage knoppen -------------------------------------

const STAGGER_MS = 110;
const DURATION_MS = 650;

document.getElementById("btn-explode").addEventListener("click", () => {
  const ordered = [...parts].sort((a, b) => b.order - a.order);
  ordered.forEach((part, i) => startTween(part, 1, i * STAGGER_MS, DURATION_MS));
  setTimeout(updateToggleButton, ordered.length * STAGGER_MS + DURATION_MS);
});

document.getElementById("btn-assemble").addEventListener("click", () => {
  const ordered = [...parts].sort((a, b) => a.order - b.order);
  ordered.forEach((part, i) => startTween(part, 0, i * STAGGER_MS, DURATION_MS));
  setTimeout(updateToggleButton, ordered.length * STAGGER_MS + DURATION_MS);
});

// --- Handmatige demontagegraad-slider ---------------------------------------

rangeInput.addEventListener("input", () => {
  stopAllTweens();
  const t = Number(rangeInput.value) / 100;
  parts.forEach((part) => applyT(part, t));
  updateToggleButton();
});

// --- Onderdelenlijst (checklist: gekocht / nog te kopen) --------------------

const CHECKLIST_STORAGE_KEY = "e36-onderdelen-status";

function loadStatusMap() {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStatusMap(map) {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage kan onbeschikbaar zijn (bv. privénavigatie); status wordt dan niet bewaard.
  }
}

const statusMap = loadStatusMap();

function statusKey(systemId, partId) {
  return `${systemId}::${partId}`;
}

function isBought(systemId, partId) {
  return !!statusMap[statusKey(systemId, partId)];
}

function setBought(systemId, partId, bought) {
  const key = statusKey(systemId, partId);
  if (bought) statusMap[key] = true;
  else delete statusMap[key];
  saveStatusMap(statusMap);
}

// Platte lijst van alle onderdelen in alle systemen, voor de checklist.
// De meshes zijn hier alleen nodig om aan de metadata te komen en worden meteen weer opgeruimd.
const allPartsBySystem = SYSTEMS.map((systemModule) => {
  const defs = systemModule.createParts();
  defs.forEach((def) => disposeObject3D(def.mesh));
  return {
    systemModule,
    parts: [...defs]
      .sort((a, b) => a.order - b.order)
      .map((def) => ({ id: def.id, name: def.name, order: def.order })),
  };
});

const checklistOverlay = document.getElementById("checklist-overlay");
const checklistBody = document.getElementById("checklist-body");
const checklistSummary = document.getElementById("checklist-summary");

function totalPartsCount() {
  return allPartsBySystem.reduce((sum, s) => sum + s.parts.length, 0);
}

function boughtPartsCount() {
  let count = 0;
  allPartsBySystem.forEach(({ systemModule, parts: sysParts }) => {
    sysParts.forEach((p) => {
      if (isBought(systemModule.meta.id, p.id)) count++;
    });
  });
  return count;
}

function updateChecklistSummary() {
  checklistSummary.textContent = `${boughtPartsCount()} van ${totalPartsCount()} onderdelen gekocht`;
}

function updateSystemProgress(systemId) {
  const group = allPartsBySystem.find((s) => s.systemModule.meta.id === systemId);
  if (!group) return;
  const bought = group.parts.filter((p) => isBought(systemId, p.id)).length;
  const el = checklistBody.querySelector(`[data-system-progress="${systemId}"]`);
  if (el) el.textContent = `${bought}/${group.parts.length}`;
}

function buildChecklist() {
  checklistBody.innerHTML = "";
  allPartsBySystem.forEach(({ systemModule, parts: sysParts }) => {
    const section = document.createElement("section");
    section.className = "checklist-system";

    const header = document.createElement("div");
    header.className = "checklist-system-header";
    const h3 = document.createElement("h3");
    h3.textContent = systemModule.meta.name;
    const progress = document.createElement("span");
    progress.className = "checklist-system-progress";
    progress.dataset.systemProgress = systemModule.meta.id;
    header.append(h3, progress);
    section.appendChild(header);

    const ul = document.createElement("ul");
    ul.className = "checklist-items";

    sysParts.forEach((p) => {
      const li = document.createElement("li");
      li.className = "checklist-item";

      const bought = isBought(systemModule.meta.id, p.id);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checklist-checkbox";
      checkbox.checked = bought;
      checkbox.setAttribute("aria-label", `${p.name} gekocht`);

      const nameBtn = document.createElement("button");
      nameBtn.type = "button";
      nameBtn.className = "checklist-part-name";
      nameBtn.textContent = p.name;
      nameBtn.addEventListener("click", () => {
        hideChecklist();
        loadSystem(systemModule);
        selectPart(p.id);
      });

      const badge = document.createElement("span");
      badge.className = `checklist-badge ${bought ? "bought" : "tobuy"}`;
      badge.textContent = bought ? "Gekocht" : "Nog te kopen";

      checkbox.addEventListener("change", () => {
        setBought(systemModule.meta.id, p.id, checkbox.checked);
        badge.textContent = checkbox.checked ? "Gekocht" : "Nog te kopen";
        badge.classList.toggle("bought", checkbox.checked);
        badge.classList.toggle("tobuy", !checkbox.checked);
        updateSystemProgress(systemModule.meta.id);
        updateChecklistSummary();
      });

      li.append(checkbox, nameBtn, badge);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    checklistBody.appendChild(section);
  });

  allPartsBySystem.forEach(({ systemModule }) => updateSystemProgress(systemModule.meta.id));
  updateChecklistSummary();
}

function showChecklist() {
  buildChecklist();
  checklistOverlay.classList.remove("hidden");
}

function hideChecklist() {
  checklistOverlay.classList.add("hidden");
}

document.getElementById("btn-checklist").addEventListener("click", showChecklist);
document.getElementById("btn-close-checklist").addEventListener("click", hideChecklist);
checklistOverlay.addEventListener("click", (event) => {
  if (event.target === checklistOverlay) hideChecklist();
});

// --- Render loop -------------------------------------------------------------

function resize() {
  const { clientWidth: w, clientHeight: h } = renderer.domElement.parentElement;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);
resize();

function animate(now) {
  tickTweens(now);
  refreshPartsListState();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// --- Start ---------------------------------------------------------------

loadSystem(SYSTEMS[0]);
