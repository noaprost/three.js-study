import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Domino } from "./Domino";

// ----- 주제: 도미노

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

  // Loader
  const gltfLoader = new GLTFLoader();

  // Cannon(물리 엔진)
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -9.8, 0); // 중력

  // 성능을 위한 세팅
  //   cannonWorld.allowSleep = true;
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const rubberMaterial = new CANNON.Material("rubber");
  const ironMaterial = new CANNON.Material("iron");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.01,
      restitution: 0.9,
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
    new THREE.PlaneGeometry(10, 40),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = THREE.MathUtils.degToRad(-90);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 도미노 생성
  const dominos = [];
  let domino;

  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      scene,
      cannonWorld,
      gltfLoader,
      z: -i * 0.8,
      index: i,
    });
    dominos.push(domino);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    dominos.forEach((domino) => {
      if (domino.cannonBody) {
        domino.modelMesh.position.copy(domino.cannonBody.position);
        domino.modelMesh.quaternion.copy(domino.cannonBody.quaternion);
      }
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
  // RayCaster
  const rayCaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkIntersects() {
    rayCaster.setFromCamera(mouse, camera);

    const intersects = rayCaster.intersectObjects(scene.children);

    for (const item of intersects) {
      if (item.object.cannonBody) {
        // 인자 : 힘의 크기, 방향
        item.object.cannonBody.applyForce(
          new CANNON.Vec3(0, 0, -100),
          new CANNON.Vec3(0, 0, 0)
        );
        break;
      }
    }
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    if (preventDragClick.mouseMoved) return;
    // -1~1
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
