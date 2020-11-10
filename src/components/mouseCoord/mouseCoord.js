function getX(obj) {
  let parObj = obj;
  let left = obj.offsetLeft;
  while (parObj = parObj.offsetParent) {
    left += parObj.offsetLeft;
  }
  return left;
}

function getY(obj) {
  let parObj = obj;
  let top = obj.offsetTop;
  while (parObj = parObj.offsetParent) {
    top += parObj.offsetTop;
  }
  return top;
}

function DisplayCoord(event) {
  let top,
    left,
    oDiv;
  oDiv = document.getElementById('imgWrap');
  top = getY(oDiv);
  left = getX(oDiv);
  document.getElementById('mp_x').innerHTML = `${(event.clientX - left + document.body.scrollLeft) - 2}`;
  document.getElementById('mp_y').innerHTML = `${(event.clientY - top + document.body.scrollTop) - 2}`;
}
export default DisplayCoord;
