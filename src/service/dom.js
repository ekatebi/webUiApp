// Helper function to get an element's exact position
export function getPosition(el) {
  let xPos = 0;
  let yPos = 0;
 
  while (el) {
    if (el.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      const yScroll = el.scrollTop || document.documentElement.scrollTop;
 
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
 
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}

/*

var clientHeight = document.getElementById('myDiv').clientHeight;
or

var offsetHeight = document.getElementById('myDiv').offsetHeight;
clientHeight includes padding.

offsetHeight includes padding, scrollBar and borders.

*/

export function windowDimensions() {

  const w = window;
  const d = document;
  const documentElement = d.documentElement;
  const body = d.getElementsByTagName('body')[0];
  const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
  const height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

  return {
    width, 
    height
  };
}

export function getAbsolutePosition(element) {
  const r = { x: element.offsetLeft, y: element.offsetTop };
  if (element.offsetParent) {
    const tmp = getAbsolutePosition(element.offsetParent);
    r.x += tmp.x;
    r.y += tmp.y;
  }
  return r;
}
