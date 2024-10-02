import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light 기본, Light 애니메이션

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

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
  /**
   * AmbientLight(색상, 빛의 강도)
   * 은은한 빛
   * 그림자나 이런걸 추가해주지는 않아서 입체 형태가 만들어지지는 않음
   * 단색으로 Basic Material 형태를 보여줌
   * 이것만 단독으로 사용하는 경우는 없고, 기본 배경으로 깔아주고
   * 다른 조명과 함께 사용함
   * 전체적으로 빛을 뿌려주기 때문에 위치 속성이 필요가 없음
   */
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  /**
   * DirectionalLight
   * 태양광과 같은 존재
   * 전체적으로 뿌려지지만 다만 빛을 못받거나 덜받는 부분에는 그림자를 만들어냄
   */

  const light = new THREE.DirectionalLight("red", 2);
  light.position.y = 3;
  scene.add(light);

  // LightHelper : 정확히 빛이 어디에 있는지 알 수 있게 해주는 도구
  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = THREE.MathUtils.radToDeg(90);
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

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

    light.position.x = Math.cos(time) * 5;
    light.position.z = Math.sin(time) * 5;

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
