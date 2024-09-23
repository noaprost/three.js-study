import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { MySphere } from "./MySphere";

// ----- 주제: 오브젝트 제거하기

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

  // 성능을 위한 세팅
  cannonWorld.allowSleep = true;
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const rubberMaterial = new CANNON.Material("rubber");
  const ironMaterial = new CANNON.Material("iron");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.5,
      restitution: 0.3,
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

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    spheres.forEach((sphere) => {
      sphere.mesh.position.copy(sphere.cannonBody.position);
      sphere.mesh.quaternion.copy(sphere.cannonBody.quaternion);
    });

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

  // 충돌 시 사운드 재생
  const sound = new Audio("./sounds/boing.mp3");
  function collide(e) {
    const velocity = e.contact.getImpactVelocityAlongNormal();
    if (velocity < 3) return;
    sound.currentTime = 0;
    sound.play();
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    const mySphere = new MySphere({
      scene,
      cannonWorld,
      geometry: sphereGeometry,
      material: sphereMaterial,
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * 5 + 2,
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() + 0.2,
    });
    spheres.push(mySphere);

    mySphere.cannonBody.addEventListener("collide", collide);
  });

  // 삭제하기
  const btn = document.createElement("button");
  btn.style.cssText = `position: absolute; left: 20px; top: 20px; font-size: 20px;`;
  btn.innerHTML = "삭제";
  document.body.append(btn);

  btn.addEventListener("click", () => {
    spheres.forEach((sphere) => {
      // 불필요한 메모리 점유를 없애기 위함 (이벤트, 캐논 body)
      sphere.cannonBody.removeEventListener("collide", collide);
      cannonWorld.removeBody(sphere.cannonBody);

      scene.remove(sphere.mesh); // 눈에 보이는 메쉬를 지워줌
    });
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
