var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
require('dotenv').config();

app.use(bodyParser.json()); // for parsing application/json

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/todo.html'));
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/todo.html'));
});

app.post('/api/create_user', function (req, res) {
  console.log(req.body);
  console.log(req.headers);

  unirest.post("http://app.kloudbit.com/1.0/users")
    .headers({'Authorization':'Basic '+process.env.KLOUDBIT_BASIC_TOKEN})
    .send("username="+req.body.username)
    .send("password="+req.body.password)
    .end(function (response) {
      console.log(response.body);

      response.body = JSON.parse(response.body);
      console.log(response.body);

      if(response.body.content){
        req.session.access_token = response.body.content.access_token;
        req.session.username = username;
        console.log(req.session);
      }

      res.send(response.body);
    });

  res.end();
});

app.listen(3002, function () {
  console.log('Example app listening on port 3002!')
});

