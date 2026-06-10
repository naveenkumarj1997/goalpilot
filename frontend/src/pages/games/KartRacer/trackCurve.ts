import * as THREE from 'three';

export const trackCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 0, 80),
  new THREE.Vector3(50, 0, 150),
  new THREE.Vector3(120, 0, 150),
  new THREE.Vector3(180, 0, 80),
  new THREE.Vector3(180, 0, -80),
  new THREE.Vector3(120, 0, -150),
  new THREE.Vector3(50, 0, -150),
  new THREE.Vector3(0, 0, -80),
], true); // true = closed loop

// The physical width of the drivable road from the center point
export const TRACK_WIDTH = 15;
