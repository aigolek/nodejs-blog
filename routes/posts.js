var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images' })
var mongo = require('mongodb');
const url = 'mongodb+srv://admin:admin@cluster0.fqawd.mongodb.net/nodeblogs?retryWrites=true&w=majority'
var db = require('monk')(url);


router.get('/show/:id', function(req, res, next) {
  let posts = db.get('posts');
  posts.find({_id: req.params.id},{}, function(err, post){ 
    res.render('show', {
      'post': post[0]
    });
  })
});

/* GET posts listing. */
router.get('/add', function(req, res, next) {
  let categories = db.get('categories');
  categories.find({},{}, function(err, categories){
    res.render('addpost', {
      'title': 'Add Post',
      'categories': categories
    });
  })
  
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
    let {title, category, body, author, created_at} = req.body;
    let date = new Date();
    let mainimage;
    //check image upload
    if(req.file){
      mainimage = req.file.filename;      
    }else{
      mainimage = 'noimage.jpeg';
    }
    // form validation 
    req.checkBody('title', 'Title filed is required').notEmpty();
    req.checkBody('body', 'Body filed is required').notEmpty();
    
    //check errors
    let errors = req.validationErrors();
    if(errors){
      res.render('addpost',{
        "errors": errors
      })
    }else{
      let posts = db.get('posts')
      posts.insert({
        "title": title,
        "body": title,
        "category": category,
        "created_at": created_at,
        "author": author,
        active: true,
        "mainimage": mainimage,
      }, function(err,post){
        if (err){
          res.send(err)
        }else{
          req.flash('success', 'Post added')
          res.location('/');
          res.redirect('/');
        }
      });
    }
  });

  router.post('/addcomment', function(req, res, next) {
    let {name, email, body, commentdate, postid} = req.body;
    let date = new Date();
    // form validation 
    req.checkBody('name', 'Name filed is required').notEmpty();
    req.checkBody('email', 'Email filed is required but never displayed').notEmpty();
    req.checkBody('email', 'Email is not formatted properly').isEmail();
    req.checkBody('body', 'Body filed is required').notEmpty();
    
    //check errors
    let errors = req.validationErrors();
    if(errors){
      var posts = db.get("posts");
      posts.findByID(postid, function(err, post){
        res.render('show',{
          "errors": errors,
          "post": post
        })
      })
      
    }else{
      let comment = {
        "name": name,
        "email": email,
        "body": body,
        "commentdate": commentdate
      }
      var posts = db.get('posts');
      console.log("comment::::", comment)
      posts.update({
        "_id": postid
      },{
        $push: {
          "comments": comment
        }
      }, function(err,doc){
        if (err){
          console.log("err comment::::", err)
          throw err
        }else{
          console.log("success comment::::", postid)
          req.flash('success', 'Comment added')
          res.location('/posts/show/'+postid);
          res.redirect('/posts/show/'+postid);
        }
      });
    }
  });

module.exports = router;
