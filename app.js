const express = require('express');
const app = express();
//path comes with node.js
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');


mongoose.Promise = global.Promise;
// odm object document mapper
//.then is promise
mongoose.connect(mongoDbUrl).then((db)=>{

	console.log('MONGO connected');
}).catch(error=> console.log('could not connect' + error));



app.use(express.static(path.join(__dirname, 'public')));

//set view engine
const {select, generateDate, paginate} = require('./helpers/handlebars-helpers');
//looks in views directory for file 
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateDate: generateDate, paginate: paginate}}));
//app.set sets the view engine to be handlebars
app.set('view engine', 'handlebars');

//Upload middleware
//to upload files
app.use(upload());

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//method Override
app.use(methodOverride('_method'));

app.use(session({
	secret: 'laurajohnson',
	resave: true,
	saveUniitialized: true
}));

app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());


// local variables using middleware
app.use((req, res, next)=>{

	res.locals.user = req.user || null;

	res.locals.success_message = req.flash('success_message');

	res.locals.error_message = req.flash('error_message');

	res.locals.form_errors = req.flash('form_errors');

	res.locals.error = req.flash('error');

	next();
});


//load Routes
// requiring main routes for home and admin posts. means same level as app.js 
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//use routes
//let app know about routes everytime someone goes to our route ('/') execute the main route
app.use('/', home);
//must type in admin to get to admin
app.use('/admin', admin);
//posts
app.use('/admin/posts', posts);
app.use('/admin/categories', categories);
app.use('/admin/comments', comments);


const port = process.env.PORT || 4500;
app.listen(port, ()=>{

console.log(`listening on port ${port}`);

});

