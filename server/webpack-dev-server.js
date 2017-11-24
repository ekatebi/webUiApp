var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

var port = 3000;
var hostname = 'localhost';

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  // noInfo: true,
  historyApiFallback: true,
  contentBase: '.',
  stats: {
    colors: true
  }
}).listen(port, hostname, (error, result) => {
  if(error)
    console.error(error);
  console.info("==> ✅  Server is listening");
  console.info("==> 🌎  Go to http://%s:%s", hostname, port);
});

