import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: 특정 방형의 광선(Ray)에 맞은 Mesh 판별하기
/**
 * Raycaster(클릭 감지)
 * 여기서 Ray는 X-ray 할 때의 그 ray. 광선을 의미. 광선이 메쉬에 닿으면 그것을 감지한다고 표현함
 * 카메라쪽에서 이 광선을 쏘면 이를 통해 클릭된 메쉬를 선택할 수 있음.
 * 광선이 향하는 길에 두개 이상의 메쉬가 있다면 첫번째로 감지된 것만 선택할 수 있는데, 이를 클릭 감지라고 함
 * 실제로 Raycaster에서 나온 광선은 우리 눈에는 보이지 않음
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

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 5;
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

  // Mesh
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });

  const points = [];
  points.push(new THREE.Vector3(0, 0, 100));
  points.push(new THREE.Vector3(0, 0, -100));
  // 이미 만들어진 모양이 아닌 내가 임의로 그린 모양으로 geometry를 생성할 수 있게 해줌
  // point 배열에 들어있는 점들의 위치를 기반으로 geo의 형태가 세팅이 됨
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // 선분을 만들 때는 Mesh가 아니라 Line으로 생성해줌
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

  const boxGeoMetry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: "plum",
  });
  const boxMesh = new THREE.Mesh(boxGeoMetry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: "lime",
  });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";

  scene.add(boxMesh, torusMesh);

  // 체크하는 과정에서 편리하게 만들기 위해 배열로 만들어줌
  const meshes = [boxMesh, torusMesh];

  // Raycaster
  const raycaster = new THREE.Raycaster();

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.cos(time) * 3;
    torusMesh.position.y = Math.sin(time) * 2;
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");

    // 광선을 쏘는 출발점
    const origin = new THREE.Vector3(0, 0, 100);
    // 광선의 방향 (-z축 방향) : 정교화 된 방향으로 만들어야 함
    // 정교화하지 않을 경우 Mesh 감지가 되지 않음
    const direction = new THREE.Vector3(0, 0, -1);
    // 정교화를 따로 하고 싶을 경우 사용
    // direction.normalize()
    raycaster.set(origin, direction);

    // 광선에 배열에 있는 Mesh중 어떤 Mesh가 맞았는지 콘솔에 출력하도록 하는 코드
    // console.log(raycaster.intersectObjects(meshes));
    // 광선의 맞은 Mesh개수가 아닌 맞은 면의 개수를 말해줌

    const intersects = raycaster.intersectObjects(meshes);
    intersects.forEach((item) => {
      console.log(item.object.name);
      item.object.material.color.set("red");
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

  draw();
}
