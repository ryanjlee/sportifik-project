var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

app.listen(process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, '/../client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Database connection
mongoose.connect('mongodb://sport-admin:sport123@ds041673.mongolab.com:41673/sport-project');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected to database');
});

// Mongoose Schema for DB
var ListingSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  image: {
    type: String
  },
  gender: {
    type: String
  },
  birthday: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  }
});
var Profile = mongoose.model('profile', ListingSchema);


// Handle request for data
app.get('/Data.json', function(req, res) {
  // fs.readFile('server/Data.json', function(err, data) {
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.json(JSON.parse(data));
  // });

  Profile.find({}, function (err, data) {
    if (err) return console.log(err);
  })
  .sort({ name: 1 })
  .exec(function (err, data) {
    if (err) return console.log(err);
    res.send(data);
  });
});
