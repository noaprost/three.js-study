import * as THREE from "three";

// ----- 주제: 기본 장면

export default function example() {
  // Rerender

  // 동적으로 캔버스 조립하기
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window, innerHeight);
  // // renderer.domElement : renderer가 가지고 있는 canvas
  // document.body.appendChild(renderer.domElement);

  const canvas = document.querySelector("#three-canvas");
  // canvas라는 속성을 html에서 가져온 canvas로 설정해준다는 의미
  // const renderer = new THREE.WebGLRenderer({canvas: canvas})
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Scene
  const scene = new THREE.Scene();

  // Camere
  // 무난하게 값을 세팅
  // const camera = new THREE.PerspectiveCamera(
  //   75, // 시야각(field of view)
  //   window.innerWidth / window.innerHeight, // 종횡비
  //   0.1, // near
  //   1000 // far
  // );
  // camera.position.x = 1;
  // camera.position.y = 2;
  // camera.position.z = 5; // 카메라 위치 설정을 안한 경우 초기값은 (0, 0, 0)

  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight), // left
    window.innerWidth / window.innerHeight, // right
    1, // top
    -1, // bottom
    0.1, // near
    1000 // far
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;
  camera.lookAt(0, 0, 0); // 지정된 위치를 카메라가 바라보도록 해줌
  camera.zoom = 0.5; //  줌 아웃
  camera.updateProjectionMatrix(); // 줌과 같은 설정을 바꿔준 경우 이 메소드를 호출해줘야함
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // 가장 기본적인 재질 빛의 영향을 안받기 떄문에 빛이 없어도 눈에 보임
  const metarial = new THREE.MeshBasicMaterial({
    color: "red",
  });

  const mesh = new THREE.Mesh(geometry, metarial);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);
}
