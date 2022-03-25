var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
const url = 'mongodb+srv://admin:admin@cluster0.fqawd.mongodb.net/nodeblogs?retryWrites=true&w=majority'
var db = require('monk')(url);
var postData = db.get('posts');

/* GET home page. */
router.get('/', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({},{}, function(err, docs){
    res.render('index', {posts: docs});
  })

});

module.exports = router;
