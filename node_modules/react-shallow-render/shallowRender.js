var React = require('react/addons');

function shallowRender(element) {
  var shallowRenderer = React.addons.TestUtils.createRenderer();
  shallowRenderer.render(element);
  return shallowRenderer.getRenderOutput();
}

module.exports = shallowRender;
