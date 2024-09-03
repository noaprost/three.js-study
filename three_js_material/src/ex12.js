import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: MeshMatcapMaterial
// 원형의 모형에 입체감이 나게 쉐도우나 하이라이트 같은 걸 넣어서 texture를 만들어 놓으면
// 그것을 기반으로 우리가 만든 형태에 입체감이 유지되도록 적용해줌

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
  const matcapTex = textureLoader.load("/textures/matcap/Copper_1.png");

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
  //   scene.background = new THREE.Color("white");

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
  const directionalLight = new THREE.DirectionalLight("white", 6);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Mesh
  const geometry = new THREE.ConeGeometry(1, 2, 64);
  const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTex,
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
