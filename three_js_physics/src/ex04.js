import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { MySphere } from "./MySphere";

// ----- 주제: Perfomance(성능 좋게 하기)

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
  cannonWorld.allowSleep = true; // body가 엄청 느려지면, 테스트 안함
  /**
   * 즉, 거의 멈춰서 더이상 충돌 감지 등이 의미가 없는 body를 테스트에서 제외해줌
   * 테스트하는 애가 줄어서 성능이 좋아짐
   * 다만, 게임을 만들 때는 거의 멈춘 경우에도 테스트를 해야하는 경우가 있을 수 있으므로 주의
   */
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
  /**
   * 성능이 위의 코드보다 좋음
   * 적절히 효율적으로 타협하는 느낌
   * 퀄리티도 저하시키지 않으면서 펴포먼스도 잘 나오는 그런 세팅
   * SAPBroadphase - 제일 좋음
   * NaiveBroadphase - 기본값
   * GridBroadphase - 구역을 4개로 나누어서 필요한 쪽을 테스트
   */

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

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    // 클릭할 때마다 스피어를 생성
    spheres.push(
      new MySphere({
        scene,
        cannonWorld,
        geometry: sphereGeometry,
        material: sphereMaterial,
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 5 + 2,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() + 0.2,
      })
    );
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
