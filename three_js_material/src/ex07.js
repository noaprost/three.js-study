import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: 로딩 매니저 (여러 개의 텍스쳐 이미지 로드하기)

export default function example() {
  // 텍스쳐 이미지 로드
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로딩 시작!");
  };

  // 이미지가 로드 될 떄마다 뭔가를 해줘야 할 때 이 함수를 이용할 수 있음
  loadingManager.onProgress = (img) => {
    console.log(img + " 로드 중!");
  };

  loadingManager.onLoad = () => {
    console.log("모든 이미지 로드 완료!");
  };

  loadingManager.onError = () => {
    console.log("로드 에러!");
  };

  // 인자로 넣어주면 텍스쳐 로더를 통해서 이미지들을 로드할 때 로딩 매니저가 동작함
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const baseColorTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_basecolor.jpg"
  );
  const ambientTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_ambientOcclusion.jpg"
  );
  const normalTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_normal.jpg"
  );
  const roughnessTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_roughness.jpg"
  );
  const heightTex = textureLoader.load(
    "/textures/brick/Brick_Wall_019_height.png"
  );

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
  scene.background = new THREE.Color("white");

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
  const directionalLight = new THREE.DirectionalLight("white", 0.5);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({
    // color: "orange",
    map: baseColorTex,
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

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
