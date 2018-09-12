const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require('../../helpers/authentication');



router.all('/*', userAuthenticated, (req, res, next)=>{
    //layout setting overwritten by admin
	req.app.locals.layout = 'admin';
    //load next routes
	next();
});

//Read
router.get('/', (req, res)=>{

	Comment.find().populate('user')
  .then(comments=>{

		res.render('admin/comments', {comments: comments});

	});
});

//Create
router.post('/', ( req, res)=>{
                 //need _id: to find post
  Post.findOne({_id: req.body.id}).then(post=>{

       
    const newComment = new Comment({

      user: req.user.id,
      body: req.body.body
    }); 

      post.comments.push(newComment);

      post.save().then(savedPost=>{
      newComment.save().then(savedComment=>{

        req.flash('success_message', 'Your comment will be reviewed in a second');
        res.redirect(`/post/${post.id}`);
      });
    });
  });
});

//Delete
router.delete('/:id', (req, res)=>{
  Comment.remove({_id: req.params.id}).then(deleteItem=>{
      //find post and any comments with the same id as post
      Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{
        if(err) console.log(err);
         // req.flash('success_message', 'Comment was successfully deleted');
         res.redirect('/admin/comments');

      });

  });
});

router.post('/approve-comment', (req, res)=>{
      Comment.findByIdAndUpdate(req.body.id, {$set: {approveComment: req.body.approveComment}}, (err, result)=>{
        if(err) return err;
        res.send(result);  

      });
});


module.exports = router;

