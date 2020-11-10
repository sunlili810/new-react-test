const nn6 = document.getElementById && !document.all;
let oDiv;
let oDragObj;
let isdrag = false;
let x;
let y;
let nTX;
let nTY;

export default class Drag {
  // 获取div的四个顶点坐标
  static getDivPosition() {
    const odiv = document.getElementById('picDiv');
    const screnWidth = document.body.clientWidth;
    return {
      xLeft: odiv.getBoundingClientRect().left,
      xRigh: odiv.getBoundingClientRect().left + screnWidth - 145,
      yTop: odiv.getBoundingClientRect().top,
      yBottom: odiv.getBoundingClientRect().top + screnWidth - 145
    };
  }

  // 获取鼠标坐标
  static mousePos(e) {
    const ev = e || window.event;
    return {
      x: ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
      y: ev.clientY + document.body.scrollTop + document.documentElement.scrollTop
    };
  }

  // 鼠标移动
  static moveMouse(e) {
    // 鼠标的坐标
    const x1 = Drag.mousePos(e).x;
    const y1 = Drag.mousePos(e).y;
    // div的四个顶点坐标
    const xLeft = Drag.getDivPosition().xLeft;
    const xRigh = Drag.getDivPosition().xRigh;
    const yTop = Drag.getDivPosition().yTop;
    const yBottom = Drag.getDivPosition().yBottom;

    if (isdrag && x1 > xLeft && x1 < xRigh && y1 > yTop && y1 < yBottom) {
      oDragObj.style.top = `${nn6 ? nTY + e.clientY - y : nTY + event.clientY - y}px`;
      oDragObj.style.left = `${nn6 ? nTX + e.clientX - x : nTX + event.clientX - x}px`;
      return false;
    }
    return true;
  }

  // 鼠标按下才初始化
  static initDrag(e) {
    let oDragHandle = nn6 ? e.target : event.srcElement;
    const topElement = 'HTML';
    if (e.target.parentNode.className === 'message-building' || e.target.className === 'message-building' || e.target.parentNode.className === 'moreInfo') {
      $('.pop-div').show();
    } else {
      $('.pop-div').hide();
    }
    while (oDragHandle.tagName !== topElement && oDragHandle.className !== 'dragAble') {
      oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
    }
    if (oDragHandle.className === 'dragAble') {
      isdrag = true;
      oDragObj = oDragHandle;
      nTY = parseInt(oDragObj.style.top + 0, 10);
      y = nn6 ? e.clientY : event.clientY;
      nTX = parseInt(oDragObj.style.left + 0, 10);
      x = nn6 ? e.clientX : event.clientX;
      $(document).on('mousemove', Drag.moveMouse);
      return false;
    }
    return true;
  }

  static offDrag() {
    isdrag = false;
    $(document).off('mousemove');
  }

  /* 以下是为了兼容切换到手机模式的拖拽事件 */

  // touch鼠标移动
  static touchmoveMouse(e) {
    oDragObj.style.top = `${nn6 ? nTY + e.touches[0].clientY - y : nTY + event.touches[0].clientY - y}px`;
    oDragObj.style.left = `${nn6 ? nTX + e.touches[0].clientX - x : nTX + event.touches[0].clientX - x}px`;
    return false;
  }

  static initTouchDrag(e) {
    oDiv = document.getElementById(e.currentTarget.id);
    let oDragHandle = nn6 ? e.target : event.srcElement;
    const topElement = 'HTML';
    while (oDragHandle.tagName !== topElement && oDragHandle.className !== 'dragAble') {
      oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
    }
    if (oDragHandle.className === 'dragAble') {
      isdrag = true;
      oDragObj = oDragHandle;
      nTY = parseInt(oDragObj.style.top + 0, 10);
      y = nn6 ? e.touches[0].clientY : event.touches[0].clientY;
      nTX = parseInt(oDragObj.style.left + 0, 10);
      x = nn6 ? e.touches[0].clientX : event.touches[0].clientX;
      oDiv.addEventListener('touchmove', Drag.touchmoveMouse);
      return false;
    }
    return true;
  }

  /* 以上是为了兼容切换到手机模式的拖拽事件 */
}

