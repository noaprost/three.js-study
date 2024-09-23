import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

// ----- 주제: cannon.js 기본 세팅

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/
// 주의! https 아니고 http

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
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -9.8, 0); // 중력

  // cannon 세계의 바닥
  const floorShape = new CANNON.Plane(); // Geometry가 캐논에서는 Shape
  // body : 물리 현상이 적용되서 움직이는 실체 (눈에는 보이지 않음)
  const floorBody = new CANNON.Body({
    mass: 0, // 바닥 (중력의 영향을 안받게 하려면 mass를 0으로 설정)
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  cannonWorld.addBody(floorBody);

  // cannon.js에서 box는 중심을 기준으로 얼마나 갈건지 백터로 크기를 설정해줌
  const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25));
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 20, 0),
    shape: boxShape,
  });
  cannonWorld.addBody(boxBody);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = THREE.MathUtils.degToRad(-90);
  scene.add(floorMesh);

  const boxGeometry = new THREE.BoxGeometry(0.5, 5, 0.5);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.y = 0.5;
  boxMesh.position.copy(boxBody.position); // 위치
  boxMesh.quaternion.copy(boxBody.quaternion); // 회전
  scene.add(boxMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;

    // 몇분의 1초 간격으로 갱신을 해줄 건지. 현재는 60프레임으로 설정
    // 성능 개선을 위해 delta를 넣어줌
    // 시간이 잠재적으로 지연되거나 차이가 벌어지면 간격을 3번까지 보정을 하도록 설정.
    cannonWorld.step(cannonStepTime, delta, 3);
    /**
     * + 기존에 1/60으로 설정한 것에 대한 추가 설명
     * 주사율이 120이상인 화면에서는 1/60으로 해주면 오히려 성능을 활용하지 못함
     * 또한 완전히 얇은 벽 등은 그냥 뚫고 나가버리는 문제가 발생
     * 이 곳은 고정된 값을 넣어줘야 함
     * 따라서 delta값에 따라 최적화된 값을 제공하기 위한 cannonStepTime을 설정해줌
     */
    boxMesh.position.copy(boxBody.position); // 위치
    boxMesh.quaternion.copy(boxBody.quaternion); // 회전

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
