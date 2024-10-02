import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light와 Shadow
// 그림자는 renderer, light, mesh에 각각 설정을 해줘야함
/**
 * 캐스트 쉐도우
 * 다른 물체에 나의 그림자가 생기게 영향을 줄건지
 */

/**
 * 리시브 쉐도우
 * 다른 물체의 그림자의 영향을 받아서 나에게 그림자가 그려지게 할건지
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

  // 그림자 설정
  renderer.shadowMap.enabled = true;

  // 그림자 형태 자체의 퀄리티 조정을 하는 방법

  // 이것을 설정하면 radius가 적용이 안됨
  //   renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 기본 값 THREE.PCFShadowMap
  /**
   * BasicShadowMap
   * 그림자 라인에 Anti Aliasing이 사라지면서 계단 형태의 라인이 됨
   * 픽셀 아트 같은 연출을 하기에 좋음
   * 성능이 굉장히 좋음
   * 더 극단적인 픽셀 아트 느낌을 내고 싶다면 쉐도우의 맵 사이즈를 극단적으로 줄여주면 됨
   */

  /**
   * PCFSoftShadowMap
   * 기본 값보다 더 부드러운 경계로 연출해줌
   * 성능은 기본 값보다 조금 떨어짐
   */

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
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight("red", 2);
  light.position.y = 3;
  scene.add(light);

  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // 그림자 설정
  // 이렇게 해주면 이 빛은 그림자를 만들 수 있는 빛이됨
  light.castShadow = true;
  // 매끈하고 퀄리티 좋은 조명을 만드는 방법
  // 크기가 클 수록 해상도가 높아지면서 고픔질이 됨. 단, 성능에 악영향을 있음
  light.shadow.mapSize.width = 1024; // 기본 값은 512
  light.shadow.mapSize.height = 1024; // 기본 값은 512
  // 그림자의 경계를 부드럽게 풀어주는 역할 (블러)
  //   light.shadow.radius = 5;

  // 그림자에 near, far을 설정해서 카메라에 보이지 않는 부분에는 그림자를 그리지 않는 방법
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 15;

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
