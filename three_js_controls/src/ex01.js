import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: OrbitControls

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
  camera.position.z = 7;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // 컨트롤 느낌을 부드럽게 해주는 작업
  // 단독 실행은 안되고 draw 함수에서 업데이트를 해줘야함
  // 회전이 부드럽게 감속하면서 서서히 멈춤

  // 이 속성은 줌인 줌아웃 속성을 잠궈줌
  //controls.enableZoom = false;

  // max로 멀리, min으로 가까이 볼 수 있는 최대값을 설정 가능
  controls.maxDistance = 10;
  controls.minDistance = 2;

  // 수직 방향으로 회전하는 각도의 범위를 설정 가능
  controls.minPolarAngle = THREE.MathUtils.degToRad(45);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(135);

  // 회전의 중심점을 타겟 위치로 정해줌
  // controls.target.set(2, 2, 2);

  // 자동으로 계속 돌아가게 해줌, 속도도 조절 가능
  controls.autoRotate = true;
  controls.autoRotateSpeed = 30;

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
		${Math.floor(Math.random() * 205) + 50},
		${Math.floor(Math.random() * 205) + 50},
		${Math.floor(Math.random() * 205) + 50}
		)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    scene.add(mesh);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();

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
