var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');

app.listen(process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, '/../client')));
app.use('/bower_components',  express.static(__dirname + '/../bower_components'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://root:happyday123@apollo.modulusmongo.net:27017/xi8hiHih');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected to database');
});

var ListingSchema = new mongoose.Schema({
  _id: {
    type: String
  },
  body: {
    type: String
  },
  type: {
    type: String
  },
  replyUrl: {
    type: String
  },
  url: {
    type: String
  },
  title: {
    type: String
  },
  price: {
    type: String
  },
  region: {
    type: String
  },
  location: {
    type: String
  },
  hasPic: {
    type: String
  },
  date: {
    type: String
  },
  id: {
    type: String
  },
  __v: {
    type: String
  }
});

var Listing = mongoose.model('newclscrape', ListingSchema);

app.get('/listings.json', function (req, res) {
  var page = +req.query.page;
  var size = +req.query.pageSize;
  var sortObj = {}
  sortObj[req.query.field] = +req.query.order;

  Listing.find({}, function (err, listing) {
    if (err) return console.log(err);
  })
  .skip(page * size)
  .limit(size)
  .sort(sortObj)
  .exec(function (err, listing) {
    if (err) console.log(err);
    res.send(listing);
  })
});
