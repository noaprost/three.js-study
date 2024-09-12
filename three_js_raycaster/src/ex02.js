import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PreventDragClick } from "./PreventDragClick";

// ----- 주제: 클릭한 Mesh 선택하기, 드래그 클릭 방지

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

  const meshes = [boxMesh, torusMesh];

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    // boxMesh.position.y = Math.cos(time) * 3;
    // torusMesh.position.y = Math.sin(time) * 2;
    // boxMesh.material.color.set("plum");
    // torusMesh.material.color.set("lime");

    controls.update();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function checkIntersects() {
    if (preventDragClick.mouseMoved) return;
    // 카메라부터 마우스 클릭 지점으로 광선을 쏴줌
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(meshes);
    // for of 또는 forEach 문을 쓰면 Object name에 따라 처리를 한다던지 하는
    // 복잡한 작업도 가능함
    for (const item of intersects) {
      console.log(item.object.name);
      item.object.material.color.set("red");
      break;
    }

    // 이렇게 해도 자동으로 클릭된 순으로 배열에 배치가 되어서
    // 가장 앞 순서에 배치가 됨
    // 단순히 맨 앞에 있는 요소를 클릭했는지 확인할 용도라면 이렇게 코드를 작성해도 괜찮음
    // if (intersects[0]) {
    //   console.log(intersects[0].object.name);
    // }
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
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
