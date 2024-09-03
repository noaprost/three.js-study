// 키 컨트롤을 담담할 클래스
export class KeyController {
  constructor() {
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      // 예를 들어 W키를 눌렀다면 this.keys["KeyW"] = true로 표현
    });

    window.addEventListener("keyup", (e) => {
      delete this.keys[e.code];
      // e.code라는 이름의 속성을 삭제해줌
    });
  }
}
