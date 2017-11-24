import TestUtils from 'react-addons-test-utils';

export function shallowRender(element) {
  const shallowRenderer = TestUtils.createRenderer();
  shallowRenderer.render(element);
  return shallowRenderer.getRenderOutput();
}

export function treeElements(component) {
  const obj = {};
  TestUtils.findAllInRenderedTree(component, t => {
    const name = t.tagName || t.constructor.name;
    if (!name) {
      return;
    }
    if (!obj[name]) {
      obj[name] = 1;
    } else {
      obj[name]++;
    }
  });
  return obj;
}
