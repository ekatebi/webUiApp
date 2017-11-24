var koa = require('koa');
var path = require('path');
var webpack = require('webpack');
var sendfile = require('koa-sendfile');
var config = require('../webpack.config');

var app = koa();
var compiler = webpack(config);

var port = 3000;
var hostname = 'localhost';

app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('koa-webpack-hot-middleware')(compiler));

app.use(function *() {
    var stats = yield* sendfile
      .call(this, path.join(__dirname, '../index.html'));
    if(!this.status) this.throw(404);
});

app.listen(port, hostname, function(error) {
  if(error)
    console.error(error);
  console.info("==> ✅  Server is listening");
  console.info("==> 🌎  Go to http://%s:%s", hostname, port);
});

import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../src/routes'
