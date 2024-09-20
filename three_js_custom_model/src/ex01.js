import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ----- 주제: glb 파일 불러오기

/**
 * glTF : gl transmission format
 *
 * 3D 모델 포맷중에 하나
 * 3차원 장면과 모델을 표현하는 파일 포맷, JSON 표준에 기반하고 있음
 * 즉, JSON 데이터
 *
 * 이 데이터에 3D 모델링의 모양, 애니메이션, 카메라 등이 포함 되어 있고
 * 이걸 Three.js 같은 곳에서 가져다 쓸 수 있음
 *
 * glTF가 표준처럼 돼서 가장 많이 쓰이고 있음
 *
 * glTF를 binary 데이터 자체로 갖고 있는 포맷이 glb
 * 블랜더라는 프로그램을 이용해서 3D 모델을 만든 다음에
 * glTF의 binary 포맷인 glb라는 파일로 만들어서 Three.js에서 사용할 수 있음
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

  // gltf loader
  // 로더는 따로 import를 해와야 함
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    "./models/t_last_ilbuni.glb",
    // 파일 로드가 끝나면 실행되는 콜백 함수
    (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene.children[0]);
    }
  );

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

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
