var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
const url = 'mongodb+srv://admin:admin@cluster0.fqawd.mongodb.net/nodeblogs?retryWrites=true&w=majority'
var db = require('monk')(url);


router.get('/show/:category', function(req, res, next) {
    let posts = db.get('posts');
    posts.find({category: req.params.category},{}, function(err, posts){
        res.render('index', {
          'title': req.params.category,
          'posts': posts
        });
    })
});
/* GET categories listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory', {
      'title': 'Add Category',
    });
});

router.post('/add', function(req, res, next) {
    let {name} = req.body;
    req.checkBody('name', 'Name filed is required').notEmpty();
    
    //check errors
    let errors = req.validationErrors();
    if(errors){
      res.render('addpost',{
        "errors": errors
      })
    }else{
      let categories = db.get('categories')
      categories.insert({
        "name": name,
      }, function(err,post){
        if (err){
          res.send(err)
        }else{
          req.flash('success', 'Category added')
          res.location('/');
          res.redirect('/');
        }
      });
    }
  });

module.exports = router;
