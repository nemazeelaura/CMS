const express = require('express');
//wrapper to deal with routes.. now replace app.get etc w/ router.get
const router = express.Router();
//requiring category model
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', userAuthenticated, (req, res, next)=>{

	req.app.locals.layout = 'admin';

	next();

});

router.get('/', (req, res)=>{

	Category.find({}).then(categories=>{

       res.render('admin/categories/index', {categories: categories});

	});

});

router.post('/create', (req, res)=>{

    const newCategory = new Category({

        name: req.body.name

    });

    newCategory.save(savedCategory=>{

        res.redirect('/admin/categories');

    });

});


//Read
router.get('/edit/:id', (req, res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{

        res.render('admin/categories/edit', {category: category});

    });

});


//update
router.put('/edit/:id', (req, res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{

        category.name = req.body.name;
        category.save().then(savedCategory=>{

        	 res.redirect('/admin/categories');
        });

    });

});

//delete
router.delete('/:id', (req, res)=>{

    Category.remove({_id: req.params.id}).then(result=>{

             res.redirect('/admin/categories');
        });

});

module.exports = router;