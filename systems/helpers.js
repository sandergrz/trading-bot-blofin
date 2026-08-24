// Gedeelde geometrie-helpers voor alle deelsystemen.
// Houdt de stijl consistent: eenvoudige, schematische primitieven
// (geen fotorealisme), maar correct gepositioneerd en verhoudingsgewijs juist.

import * as THREE from "three";

const AXIS_VECTORS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

export function material(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 0.35,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
  });
}

// Staafvormige geometrie tussen twee punten (draagarmen, stangen, leidingen, assen).
export function makeLink(a, b, radius, color, opts = {}) {
  const pa = new THREE.Vector3(...a);
  const pb = new THREE.Vector3(...b);
  const dir = new THREE.Vector3().subVectors(pb, pa);
  const length = dir.length();
  const mid = new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5);

  const geometry = new THREE.CylinderGeometry(radius, opts.radius2 ?? radius, length, opts.segments ?? 14);
  const mesh = new THREE.Mesh(geometry, material(color, opts));
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}

// Cilinder met een gekozen as (x, y of z) op een punt — voor naven, schijven,
// poelies, tanks, katalysatoren, koppelingsonderdelen, etc.
export function makeCylinder(point, radius, length, color, opts = {}) {
  const axis = opts.axis ?? "y";
  const geometry = new THREE.CylinderGeometry(radius, opts.radius2 ?? radius, length, opts.segments ?? 24, 1, false);
  const mesh = new THREE.Mesh(geometry, material(color, opts));
  mesh.position.set(...point);
  if (axis !== "y") {
    mesh.quaternion.setFromUnitVectors(AXIS_VECTORS.y, AXIS_VECTORS[axis]);
  }
  return mesh;
}

export function makeBox(center, size, color, opts = {}) {
  const geometry = new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material(color, opts));
  mesh.position.set(...center);
  if (opts.rotationY) mesh.rotation.y = opts.rotationY;
  if (opts.rotationX) mesh.rotation.x = opts.rotationX;
  if (opts.rotationZ) mesh.rotation.z = opts.rotationZ;
  return mesh;
}

export function makeSphere(center, radius, color, opts = {}) {
  const geometry = new THREE.SphereGeometry(radius, opts.segments ?? 20, opts.segments2 ?? 16);
  const mesh = new THREE.Mesh(geometry, material(color, opts));
  mesh.position.set(...center);
  return mesh;
}

export function makeTorus(center, radiusMajor, radiusMinor, color, opts = {}) {
  const geometry = new THREE.TorusGeometry(radiusMajor, radiusMinor, opts.radialSegments ?? 12, opts.tubularSegments ?? 32);
  const mesh = new THREE.Mesh(geometry, material(color, opts));
  mesh.position.set(...center);
  const axis = opts.axis ?? "z";
  if (axis === "y") mesh.rotation.x = Math.PI / 2;
  else if (axis === "x") mesh.rotation.y = Math.PI / 2;
  return mesh;
}

export function makeCoilSpring(center, radiusCoil, tubeRadius, height, turns, color) {
  const [cx, cy, cz] = center;
  const points = [];
  const segments = 120;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const y = cy - height / 2 + t * height;
    points.push(
      new THREE.Vector3(cx + Math.cos(angle) * radiusCoil, y, cz + Math.sin(angle) * radiusCoil)
    );
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 200, tubeRadius, 8, false);
  const mesh = new THREE.Mesh(geometry, material(color, { metalness: 0.6, roughness: 0.35 }));
  return mesh;
}

// Gebogen buis tussen twee punten via een tussenpunt (slangen, leidingen, uitlaatpijpen).
export function makeCurvedTube(points, tubeRadius, color, opts = {}) {
  const vecs = points.map((p) => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(vecs);
  const geometry = new THREE.TubeGeometry(curve, opts.tubularSegments ?? 64, tubeRadius, opts.radialSegments ?? 8, false);
  return new THREE.Mesh(geometry, material(color, opts));
}
