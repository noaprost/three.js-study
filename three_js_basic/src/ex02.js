import * as THREE from "three";

// ----- 주제: 브라우저 창 사이즈 변경에 대응하기

export default function example() {
  // Rerender
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  //console.log(window.devicePixelRatio);
  // renderer.setPixelRatio(window.devicePixelRatio);
  // 2정도만 되도 대부분 선명하게 보이기 때문에
  // 아래와 같이 표현해주는 것이 성능면에서 더 유리함
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camere
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각(field of view)
    window.innerWidth / window.innerHeight, // 종횡비
    0.1, // near
    1000 // far
  );
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const metarial = new THREE.MeshBasicMaterial({
    color: "red",
  });
  const mesh = new THREE.Mesh(geometry, metarial);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);

  function setSize() {
    // 카메라
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix : 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // event
  window.addEventListener("resize", setSize);
}
