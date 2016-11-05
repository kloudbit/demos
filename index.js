var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var unirest = require('unirest');
var session = require('express-session');
require('dotenv').config();

app.use(bodyParser.json()); // for parsing application/json
app.use(session({
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  /*store: store,*/
  resave: true,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/todo.html'));
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/todo.html'));
});

app.get('/list', function (req, res) {
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

      unirest.post("http://app.kloudbit.com/1.0/oauth2/token")
        .headers({'Authorization':'Basic '+process.env.KLOUDBIT_BASIC_TOKEN})
        .query("username="+req.body.username)
        .query("password="+req.body.password)
        .end(function (response){
          console.log(response.body)

          if(response.body.access_token){
            response.body.username = req.body.username;

            req.session.access_token = response.body.access_token;
            req.session.username = req.body.username;
            console.log(req.session);
          }

          res.send(response.body);
        });
    });
});

app.listen(3002, function () {
  console.log('Example app listening on port 3002!')
});

