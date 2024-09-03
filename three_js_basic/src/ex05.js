import * as THREE from "three";

// ----- 주제: Animation 기본, 성능 보정

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
    const time = clock.getElapsedTime();

    // mesh.rotation.y += 0.01; // Radian 값을 이용함
    // mesh.rotation.y += THREE.MathUtils.degToRad(1); // 적힌 숫자가 실제 각도

    // 어떠한 성능의 기기에서도 같은 속도를 볼 수 있도록 성능 보정을 해줌
    // 이 시간은 어디에서나 절대 시간이기 때문에 이 시간 자체를 Radian 값으로 만들어줌
    mesh.rotation.y = time;

    mesh.position.y += 0.01;
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // window.requestAnimationFrame(draw);

    // Three.js를 이용해서 AR이나 VR같은 콘텐츠를 만들때는 꼭 이 함수를 사용해야함
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
