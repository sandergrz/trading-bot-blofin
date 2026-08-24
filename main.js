import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createParts } from "./parts.js";

const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x14171c);
scene.fog = new THREE.Fog(0x14171c, 6, 14);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
camera.position.set(3.6, 2.2, 3.3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0.5, -0.1, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.2;
controls.maxDistance = 10;
controls.update();

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

// --- Onderdelen opbouwen -----------------------------------------------

const PART_DEFS = createParts();

const parts = PART_DEFS.map((def) => {
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
    t: 0, // 0 = gemonteerd, 1 = gedemonteerd
    tween: null, // {fromT, toT, start, delay, duration}
  };
});

const partsById = Object.fromEntries(parts.map((p) => [p.id, p]));
const originalEmissive = new Map();
parts.forEach((p) => {
  p.mesh.traverse((child) => {
    if (child.isMesh) originalEmissive.set(child, child.material.emissive.clone());
  });
});

// --- UI: onderdelenlijst -------------------------------------------------

const partsListEl = document.getElementById("parts-list");
const sortedForList = [...parts].sort((a, b) => a.order - b.order);

sortedForList.forEach((part) => {
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

let selectedId = null;

const infoEmpty = document.getElementById("info-empty");
const infoContent = document.getElementById("info-content");
const infoOrder = document.getElementById("info-order");
const infoName = document.getElementById("info-name");
const infoFunction = document.getElementById("info-function");
const infoSequence = document.getElementById("info-sequence");
const infoMistakes = document.getElementById("info-mistakes");
const btnTogglePart = document.getElementById("btn-toggle-part");

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
  const ordered = [...parts].sort((a, b) => b.order - a.order); // laatst gemonteerde deel gaat er eerst af
  ordered.forEach((part, i) => startTween(part, 1, i * STAGGER_MS, DURATION_MS));
  setTimeout(updateToggleButton, ordered.length * STAGGER_MS + DURATION_MS);
});

document.getElementById("btn-assemble").addEventListener("click", () => {
  const ordered = [...parts].sort((a, b) => a.order - b.order); // eerst gemonteerde deel komt er eerst weer aan
  ordered.forEach((part, i) => startTween(part, 0, i * STAGGER_MS, DURATION_MS));
  setTimeout(updateToggleButton, ordered.length * STAGGER_MS + DURATION_MS);
});

// --- Handmatige demontagegraad-slider ---------------------------------------

const rangeInput = document.getElementById("explode-range");
rangeInput.addEventListener("input", () => {
  stopAllTweens();
  const t = Number(rangeInput.value) / 100;
  parts.forEach((part) => applyT(part, t));
  updateToggleButton();
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
