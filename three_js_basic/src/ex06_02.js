import * as THREE from "three";

// ----- 주제: Animation 성능 보정(feat. position)

export default function example() {
  // Rerender
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75, // 시야각(field of view)
    window.innerWidth / window.innerHeight, // 종횡비
    0.1, // near
    1000 // far
  );
  camera.position.z = 5;
  scene.add(camera);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.z = 2;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const metarial = new THREE.MeshStandardMaterial({
    color: "red",
  });
  const mesh = new THREE.Mesh(geometry, metarial);
  scene.add(mesh);

  // 그리기
  let oldTime = Date.now();

  function draw() {
    // Date를 사용했을 떄의 장점
    // Three.js와 관련이 없는 순수 JS코드이기 때문에
    // 일반 캔버스 앱을 만들 때도 사용 가능 
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    mesh.rotation.y += 0.005 * deltaTime;
    mesh.position.y += 0.001 * deltaTime;

    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }
  draw();

  function setSize() {
    // 카메라
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // event
  window.addEventListener("resize", setSize);
}
