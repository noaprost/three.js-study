import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: HemisphereLight
/**
 * HemisphereLight(색1, 색2, 강도)
 * AmbientLight랑 비슷하게 은은하게 뿌려주는 애
 * AmbientLight와 마찬가지로 그림자가 없음
 * 색의 영향을 한 각도에서 첫번쨰 색, 반대쪽 각도에서 두번째 색으로 받음
 */

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  // const ambientLight = new THREE.AmbientLight("white", 0.5);
  // scene.add(ambientLight);

  const light = new THREE.HemisphereLight("pink", "lime", 3);
  light.position.x = -5;
  light.position.y = 4;
  scene.add(light);

  const lightHelper = new THREE.HemisphereLightHelper(light);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "white" });
  const material3 = new THREE.MeshStandardMaterial({ color: "white" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = THREE.MathUtils.radToDeg(90);
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  // 그림자 설정
  plane.receiveShadow = true;
  box.castShadow = true;
  sphere.castShadow = true;

  scene.add(plane, box, sphere);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5, 0.1);
  gui.add(light.position, "y", -5, 5, 0.1);
  gui.add(light.position, "z", -5, 5, 0.1);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    // light.position.x = Math.cos(time) * 5;
    // light.position.z = Math.sin(time) * 5;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);

  draw();
}
