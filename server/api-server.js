var express = require('express');
var app = express();
var cors = require('cors');

var corsOptions = {
  origin: "http://localhost:52395"
};

app.use(cors());

app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();    
});

var token = "====token string====";

app.post('/api/v1/login', function (req, res) {
  //console.log('login', req);
  res.send({token});
});

app.get('/api/v1/organizations', function(req, res) {
  console.log('auth:', req.headers.authorization);
  if(req.headers.authorization ===  'Bearer ====token string====')
  {
    console.log('Authorized');
    res.json({org: {stuff: '8888'}});
  }
  else 
  {
    console.log('Unauthorized');
    res.status(401).send({error:'not authorized'});    
  }
});

var cultures = require('../test/data/cultures/allCultures.json');
var enabled = require('../test/data/cultures/enabledCultures.json');

app.get('/api/v1/cultures', function(req, res) {
  res.json(cultures);
});


app.get('/api/v1/cultures/enabled', function(req, res) {
  res.json(enabled);
});

app.put('/api/v1/cultures/active/:cultureCode', function(req, res) {
  res.send(200);
});

var server = app.listen(52395, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
