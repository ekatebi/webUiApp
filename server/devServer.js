
process.env.NODE_ENV='development';

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack.config');

var app = express();
var compiler = webpack(config);

var port = 4000;
var hostname = '0.0.0.0';

if (process.env.USER === "ekatebi") {
  port += 0;
} else if (process.env.USER === "dcron") {
  port += 1;
} else {
  port += 2;  
}

console.log("user:", process.env.USER, ", port:", port, ", SEC_PORT:", process.env.SEC_PORT);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  contentBase: '.',
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname+'/..'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, hostname, function(error) {
  if(error)
    console.error(error);
  console.info("==> ✅  Server is listening");
  console.info("==> 🌎  Go to http://%s:%s", hostname, port);
});
