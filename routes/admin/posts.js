const express = require('express');
//wrapper to deal with routes.. now replace app.get etc w/ router.get
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
//uploadDir from upload-helpers
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');//fs used to delete files
const {userAuthenticated} = require('../../helpers/authentication');
const Comment = require('../../models/Comment');


//grab everything in admin, next tells it to go to next piece of code
//needs to be authenticated to look at posts
router.all('/*', userAuthenticated, (req, res, next)=>{
    //layout setting overwritten by admin
	req.app.locals.layout = 'admin';
    //load next routes
	next();
});

//will be admin posts
router.get('/', (req, res)=>{
    //query gets all the posts
	Post.find({})
	    //populates the category
        .populate('category')
	    .then(posts=>{
		  	res.render('admin/posts', {posts: posts});
	});     
});

//logged-in user posts
router.get('/my-posts', (req, res)=>{
	         //user key for id
	Post.find({user: req.user.id})
		.populate('category')
		.then(posts=>{
			res.render('admin/posts/my-posts', {posts: posts});
	});
});

//create.. don't need whole path because in app.js admin/posts
router.get('/create', (req, res)=>{

	Category.find({}).then(categories=>{
    	res.render('admin/posts/create', {categories: categories});
    });
});

// posts data from form
router.post('/create', (req, res)=>{

	let errors = [];

	if(!req.body.title){

		errors.push({message: 'please add a title'});

	}

	if(!req.body.title){

		errors.push({message: 'please add a status'});

	}

	if(!req.body.body){

		errors.push({message: 'please add a description'});

	}

	if(errors.length > 0){
		res.render('admin/posts/create', {
			errors: errors
		});
	} else {


	let filename = '';

	if(!isEmpty(req.files)){

        let file = req.files.file;
        filename = Date.now() + '-' + file.name;

        file.mv('./public/uploads/' + filename, (err)=>{

            if(err) throw err;

        });


    }
   
    //check to see if check box is checked
	let allowComments = true;

	if(req.body.allowComments){
		allowComments = true;	
		} else {
	    allowComments = false;	
	}	
	//based on our schema
	//creating variable for newPost
	//object programming
	const newPost = new Post({

	   user: req.user.id,
       title: req.body.title, //name under input in views create.handlebars
       status: req.body.status,
       allowComments: allowComments, //using variable above for checkbox
       body: req.body.body,
       category: req.body.category,
       file: filename
	});

	newPost.save().then(savedPost =>{

	   req.flash('success_message', `Post ${savedPost.title} was created successfully`);

       res.redirect('/admin/posts');

	}).catch(error => {

	   console.log('could not save post');

	});

	}

});


router.get('/edit/:id', (req, res)=>{
//query gets one id in the posts from url(using req.params.id)
	Post.findOne({_id: req.params.id}).then(post=>{

		Category.find({}).then(categories=>{
    	res.render('admin/posts/edit', {post: post, categories: categories});
       });

	}); 
});

//Post Updating
router.put('/edit/:id', (req, res)=>{

	Post.findOne({_id: req.params.id})
	  .then(post=>{

		if(req.body.allowComments){

		allowComments = true;
	    } else {

	    allowComments = false;	
	    }	
			post.user = req.user.id;
			post.title = req.body.title;
			post.status = req.body.status;
			post.allowComments = allowComments;
			post.body = req.body.body;
			post.category = req.body.category;

			//using upload-helper.js
	    if(!isEmpty(req.files)){
		    //.file from form
		    let file = req.files.file;
		    //name property
		    //date now allows same pic to be uploaded more than once
		    filename = Date.now() + '-' + file.name;
		    post.file = filename;
		    //use move function from npm upload to move file
		    file.mv('./public/uploads/' + filename, (err)=>{
		    	if(err) throw err;
	    	});
    	}

		post.save().then(updatedPost=>{
			req.flash('success_message', 'Post was successfully updated');
			res.redirect('/admin/posts/my-posts');

		});
	}); 
});

//Delete
router.delete('/:id', (req, res)=>{
     Post.findOne({_id: req.params.id})
       .populate('comments')	
       .then(post=>{

       	fs.unlink(uploadDir + post.file, (err)=>{

       		if(!post.comments.length < 1){
       		  //comment array
       		  post.comments.forEach(comment=>{
       			 comment.remove();
       		  });
       		}

       		post.remove().then(postRemoved=>{

       		  req.flash('success_message', 'Post was successfully deleted');
           	  res.redirect('/admin/posts/my-posts');

           	});  		 
       	});
     });
});

module.exports = router;






