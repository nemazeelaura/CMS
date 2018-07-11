const express = require('express');
//wrapper to deal with routes.. now replace app.get etc w/ router.get
const router = express.Router();
const faker = require('faker');
//requiring post model
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');


//grab everything in admin... next tells it to go to next piece of code
router.all('/*', userAuthenticated, (req, res, next)=>{
  //layout setting overwritten by admin
	req.app.locals.layout = 'admin';
  //load next routes
	next();

});

//Read
router.get('/', (req, res)=>{

    //data for chart js
    const promises = [
        //.exec will execute query expecting a promise
        Post.count().exec(),
        Category.count().exec(),
        Comment.count().exec()
  ];
                                //pass in array of what we're expecting
    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{
        res.render('admin/index', {postCount: postCount, categoryCount: categoryCount, commentCount: commentCount});
    });  

});

//Create
router.post('/generate-fake-posts', (req, res)=>{


	for(let i = 0; i < req.body.amount; i++){
          let post = new Post();

          post.title = faker.name.title();
          post.status = 'public';
          post.allowComments = faker.random.boolean();
          post.body = faker.lorem.sentence();
          post.slug = faker.name.title();

          //promises don't work with faker

          post.save(function(err){

             if(err) throw err;

          });
	}

	res.redirect('/admin/posts');
});


module.exports = router;