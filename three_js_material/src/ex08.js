import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: 텍스쳐 이미지 변환 (위치 이동, 회전 등)

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
  const texture = textureLoader.load(
    "/textures/skull/Ground Skull_basecolor.jpg"
  );

  // 텍스쳐 변환

  texture.wrapS = THREE.RepeatWrapping; // 가로
  texture.wrapT = THREE.RepeatWrapping; // 세로

  // 아래 코드만 적용하면 자연스럽게 채워지지 않음. 위 코드를 적어줘야 함
  texture.offset.x = 0.3; // 텍스쳐가 픽셀이 늘어나면서 이동됨
  texture.offset.y = 0.3;

  texture.repeat.x = 2; // x방향으로 적은 숫자 만큼 늘어남
  // 이 코드 역시 RepeatWrapping을 해줘야 자연스러움

  texture.rotation = THREE.MathUtils.degToRad(60);
  // 돌렸을 때 회전의 기준점이 가운데에 있기를 원한다면 센터를 맞춰주면 됨
  texture.center.x = 0.5;
  texture.center.y = 0.5;

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
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // color: "orangered",
    map: texture,
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
