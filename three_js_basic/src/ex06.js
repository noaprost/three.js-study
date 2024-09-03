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
  const clock = new THREE.Clock();

  function draw() {
    // 다만 getElapsedTime과 getDelta를 같이 쓰면 값이 이상해져서 안됨
    // const time = clock.getElapsedTime();
    const delta = clock.getDelta(); // 시간이 한번 들어올 때마다의 그 시간차를 나타냄
    mesh.rotation.y += delta * 2;

    mesh.position.y += delta;
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
