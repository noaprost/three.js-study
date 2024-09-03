import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: CanvasTexture (Material에 Canvas 사용하기)
// 새로운 캔버스를 생성해서 캔버스 자체를 텍스쳐로 사용하는 방법

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

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // CanvasTexure
  const texCanvas = document.createElement("canvas");

  // 캔버스에 그림을 그리려면 Context 객체를 사용해야함
  // 아레 코드는 거의 default로 사용함
  // 이 객체로 그림을 그려서 사용할 수 있음. 붓과 같은 역할
  const texContext = texCanvas.getContext("2d");

  texCanvas.width = 500;
  texCanvas.height = 500;

  // 캔버스가 적용된 texture가 생성됨
  const canvasTexture = new THREE.CanvasTexture(texCanvas);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 입체감이 사라짐
  // 우리가 입힌 색깔이나 이미지가 있다면 그것이 그대로 보여짐
  const material = new THREE.MeshBasicMaterial({
    map: canvasTexture,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    material.map.needsUpdate = true;

    texContext.fillStyle = "green"; // 붓에 초록색 물감을 딱 찍은 상태
    texContext.fillRect(0, 0, 500, 500); // 사각형을 그려줌

    texContext.fillStyle = "orange";
    texContext.fillRect(time * 50, 100, 50, 50);

    texContext.font = "bold 50px sans-serif";
    texContext.fillText("철이", 200, 200);

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
