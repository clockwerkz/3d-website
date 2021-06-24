import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TetrahedronGeometry } from "three";

//always need 3 objects - a scene, a camera, and a renderer

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.getElementById("bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function renderStarField() {
  for (let i = 0; i < 100; i++) {
    const geo = new THREE.SphereGeometry(0.25, 24, 24);
    const geo_material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    const star = new THREE.Mesh(geo, geo_material);
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  }
}

renderStarField();

const earthTexture = new THREE.TextureLoader().load("images/earth.jpeg");

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: earthTexture,
  })
);
earth.position.z = 30;
earth.position.setX(-10);
scene.add(earth);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;


function animate() {
  renderer.render(scene, camera);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  requestAnimationFrame(animate);
}

animate();
