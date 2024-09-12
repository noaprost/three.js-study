export class PreventDragClick {
  constructor(elem) {
    // 마우스를 클릭한 상태에서 드래그가 일정 길이 이상 늘어나면
    // raycaster를 작동시키지 않도록 하는 함수
    // +로 드래그를 했다가 다시 돌아올 경우 길이가 의미가 없게 되므로
    // 시간이 얼마나 지났는지 check하는 과정도 추가
    this.mouseMoved; // 마우스를 드래그 했는지 true/false
    let clickStartX, clickStartY;
    let clickStartTime;
    elem.addEventListener("mousedown", (e) => {
      clickStartX = e.clientX;
      clickStartY = e.clientY;
      clickStartTime = Date.now();
    });
    elem.addEventListener("mouseup", (e) => {
      const xGap = Math.abs(clickStartX - e.clientX);
      const yGap = Math.abs(clickStartY - e.clientY);
      const timeGap = Date.now() - clickStartTime;

      if (xGap > 5 || yGap > 5 || timeGap > 500) {
        this.mouseMoved = true;
      } else {
        this.mouseMoved = false;
      }
    });
  }
}
