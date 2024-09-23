import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";

// ----- 주제: Force
/**
 * cannon.js에서도 재질을 설정할 수 있음
 * 마찰력과 반발력을 표현하기 위함
 * Contact Material : 재질과 재질이 닿았을 때 어떻게 처리를 할 것인지를 만드는 것
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -9.8, 0); // 중력

  // Contact Materia
  const defaultMaterial = new CANNON.Material("default");
  const rubberMaterial = new CANNON.Material("rubber");
  const ironMaterial = new CANNON.Material("iron");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    // 부딪힐 Material 두 개를 넣어줌
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.5, // 마찰력
      restitution: 0.3, // 반발력 (얼마나 튕길 것인지)
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  // cannon 세계의 바닥
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  cannonWorld.addBody(floorBody);

  const sphereShape = new CANNON.Sphere(0.5); // 인자는 반지름
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 20, 0),
    shape: sphereShape,
    material: defaultMaterial,
  });
  cannonWorld.addBody(sphereBody);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = THREE.MathUtils.degToRad(-90);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.y = 0.5;
  sphereMesh.castShadow = true;
  scene.add(sphereMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    sphereMesh.position.copy(sphereBody.position); // 위치
    sphereMesh.quaternion.copy(sphereBody.quaternion); // 회전

    // 속도 감소
    sphereBody.velocity.x *= 0.98;
    sphereBody.velocity.y *= 0.98;
    sphereBody.velocity.z *= 0.98;
    sphereBody.angularVelocity.x *= 0.98;
    sphereBody.angularVelocity.y *= 0.98;
    sphereBody.angularVelocity.z *= 0.98;

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
  canvas.addEventListener("click", (e) => {
    if (preventDragClick.mouseMoved) return;
    // 힘은 클릭할수록 누적이 되기 때문에 이를 원하지 않는다면 아래 코드를 작성하면 됨
    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;
    sphereBody.angularVelocity.x = 0;
    sphereBody.angularVelocity.y = 0;
    sphereBody.angularVelocity.z = 0;
    sphereBody.applyForce(new CANNON.Vec3(-500, 0, 0), sphereBody.position);
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
