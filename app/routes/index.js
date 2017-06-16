'use strict';

var express	 	= require('express');
var router 		= express.Router();
var passport 	= require('passport');
var moment = require('moment');
const fs = require('fs');
const multer  = require('multer');
const glob = require('glob');

var User = require('../models/user');
var Room = require('../models/room');
var Booking = require('../models/booking');
var Blog = require('../models/blog');

// Home page
router.get('/', function(req, res, next) {
	// If user is already logged in, then redirect to rooms page
	if(req.isAuthenticated()){
		res.redirect('/home');
	}
	else{
		res.render('login', {
			success: req.flash('success')[0],
			errors: req.flash('error'), 
			showRegisterForm: req.flash('showRegisterForm')[0]
		});
	}
});

// Login instead of //rooms
router.post('/login', passport.authenticate('local', { 
	successRedirect: '/home', 
	failureRedirect: '/',
	failureFlash: true
}));

// Register via username and password
router.post('/register', function(req, res, next) {

	var credentials = {'username': req.body.username, 'password': req.body.password, 'role': req.body.role };

	if(credentials.username === '' || credentials.password === ''){
		req.flash('error', 'Missing credentials');
		req.flash('showRegisterForm', true);
		res.redirect('/');
	}else{

		// Check if the username already exists for non-social account
		User.findOne({'username': new RegExp('^' + req.body.username + '$', 'i'), 'socialId': null}, function(err, user){
			if(err) throw err;
			if(user){
				req.flash('error', 'Username already exists.');
				req.flash('showRegisterForm', true);
				res.redirect('/');
			}else{
				User.create(credentials, function(err, newUser){
					if(err) throw err;
					req.flash('success', 'Your account has been created. Please log in.');
					res.redirect('/');
				});
			}
		});
	}
});

//Admin register
router.get('/v2/adminregister', function(req, res, next) {
    res.render('adminregister', { errors: null, success: null } );
})
// Social Authentication routes
// 1. Login via Facebook /****replace rooms with startroom**/
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/rooms',
		failureRedirect: '/',
		failureFlash: true
}));

// 2. Login via Twitter
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/rooms',
		failureRedirect: '/',
		failureFlash: true
}));

//room
router.get('/rooms', [User.isAuthenticated, function(req, res, next) {
        Room.find(function(err, rooms){
		if(err) throw err;
		res.render('rooms', { user: req.user, rooms: rooms, messagedrop: null });
	});
}]);

// create rooms for member automatically
router.get('/startroom', [User.isAuthenticated, function(req, res, next) {
        var username = req.user.username;
        var nomessage = null;
        var listrooms = [];
        var userna = req.user.username;
        Room.findOneAndUpdate({"title": userna }, {$set: {"status" : "started" }}, { new: true }, function(err, oneroom){
            if(err) throw err;
		if(!oneroom){
                    //return next(); 
		}
        });
        //Room.findOneAndUpdate({'title': username}, {$set: {"status" : "started" }}, { new: true },function (err, room){
        Room.find({ $or: [{'title': username}, {'roomtype':'public'}]}, function(err, rooms){
            if(err) throw err;
        
            res.render('startroom', { user: req.user, rooms: rooms, messagedrop: req.flash('info') });
        })
}]);

router.get('/adminroom', [User.isAuthenticated, function(req, res, next) {
        var userrole = req.user.role;
        var username = req.user.username;
        var noroom = null;
        req.flash('info', 'You are not authorized for this action')
        if(userrole == 'admin') {
            Room.find({'status': 'started'}, function(err, rooms){
		if(err) throw err;
		res.render('adminroom', { user: req.user, rooms: rooms, messagedrop: req.flash('infopublic') });
	});
        } else {
            res.status(301).redirect('/startroom');
        }
}]);

router.get('/createpublic', [User.isAuthenticated, function(req, res, next) {
        var userrole = req.user.role;
        var username = req.user.username;
        var noroom = null;
        //req.flash('publicinfo', 'Room Already Exists')
        req.flash('infopublic', 'Room Already Created')
        if(userrole == 'admin') {
            Room.findOne({'roomtype': 'public'}, function(err, roomp){
		if(err) throw err;
            if(roomp) {
                res.status(200).redirect('/adminroom');
            } else {
                res.render('createpublic', { user: req.user });
            }
            });
        } else {
            res.status(200).redirect('/startroom');
        }
}]);

// Chat Room 
router.get('/chat/:id', [User.isAuthenticated, function(req, res, next) {
	var roomId = req.params.id;
        
        Room.findById(roomId, function(err, room){
		if(err) throw err;
		if(!room){
			//return next(); 
		}
		res.render('chatroom', { user: req.user, room: room });
	});
}]);
        
router.get('/endchat', [User.isAuthenticated, function(req, res, next) {
	//var roomId = req.params.id;
        var userna = req.user.username;
	Room.findOneAndUpdate({"title": userna }, {$set: {"status" : "end" }}, { new: true }, function(err, room){
            if(err) throw err;
		if(!room){
			//return next(); 
		}
		res.status(301).redirect('/home');
	});
}]);

/*************for multer image upload***********************/
const deleteFiles = (dfilename) => {
	glob('public/img'+dfilename, (err,files) => {
	if (err) throw err;
		files.forEach((item,index,array) => {
		console.log(item + " found");
	});
	// Delete files
	files.forEach((item,index,array) => {
		fs.unlink(item, (err) => {
        if (err) throw err;
        console.log(item + " deleted");
		});
	});
});
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/img'); // set the destination
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname); // set the file name and extension
    }
});

const upload = multer({storage: storage});

/********Home/Blogs************/
router.get('/landing', [User.isAuthenticated, function(req, res, next) {
    res.render('pages/landing', { user: req.user.username });
    }
]);

router.get('/home', [User.isAuthenticated, function(req, res, next) {
    Blog.find({ published: "yes", dateexpired: {$gt: new Date() }}, function(err, blogs){
        if(err) throw err;
        if(blogs.length > 0){
            res.render('pages/home', { user: req.user.username, blogs: blogs, message: null });
        } else {
            res.status(301).redirect('/landing');
        }       
    })
}]);

router.get('/makeblog', [User.isAuthenticated, function(req, res, next) {
    res.render('pages/makeblog', { user: req.user.username, message: null });
}]);

router.post('/makeblog', [User.isAuthenticated, upload.single('blogimage'), function(req, res, next) {
    var blogdetails = { 'category': req.body.blogcategory, 'title': req.body.blogtitle, 
        'teaser': req.body.teaser, 'details':req.body.details, 'blogimage': req.file.filename,
        'datepublished': moment().format('YYYY-MM-DD'), 'dateexpired': req.body.expireddate,
        'dateupdated': moment().format('YYYY-MM-DD'), 'published': req.body.publish };
    
    Blog.create(blogdetails, function(err, blog){
        if(err) throw err;       
        res.render('pages/makeblog', { user: req.user.username, message: 'Blog Created Succesfully' });
    })
}]);

router.get('/fullblog/:id', [User.isAuthenticated, function(req, res, next) {
	const aval = req.params.id;
	Blog.findOne({"_id": (req.params.id)}, (err, result) => {
            if (err) return err;
	res.render('pages/fullblog', {oneblog : result } )
    })
}]);

//get a blog for update
router.get('/getblog/:id', [User.isAuthenticated, (req, res, next) => {
	const aval = req.params.id;
	Blog.findOne({"_id": (req.params.id)}, (err, result) => {
            if (err) return err;
	res.render('pages/updateblog', {oneblog : result, message: null } )
    });
}]);

router.post('/updateblog', [User.isAuthenticated, (req, res, next) => {
        
  Blog.findOneAndUpdate({"_id": (req.body.did)}, {
    $set: {
        title: req.body.upblogtitle,
	teaser: req.body.upteaser,
        details: req.body.updetails,
	category: req.body.upblogcategory,
	dateexpired: req.body.upexpireddate,
	dateupdated: moment().format('YYYY-MM-DD'),
	published: req.body.uppublish
    }
  }, {new: true},
  (err, result) => {
    if (err) return err;
    //deleteFiles(req.body.blogimage); If we desire to change the images we could, have a hiiden field with img name and send it here
    //upload.single('upblogimage');
    res.render('pages/updateblog', { oneblog: result, message: 'Blog Successfully Updated!' });
  });
  
}]);

router.get('/deleteblog/:id/:filename', [User.isAuthenticated, (req, res, next) => {
    console.log(JSON.stringify(req.params));
    glob('public/img/'+req.params.filename, (err,files) => {
	if (err) throw err;
	files.forEach((item,index,array) => {
        console.log(item + " found");
    });
    // Delete files
    files.forEach((item,index,array) => {
    fs.unlink(item, (err) => {
        if (err) throw err;
    console.log(item + " deleted");
    });
    });
});
    Blog.remove({"_id": (req.params.id)}, (err, docs) => { 
        if (err) return err;
    console.log(docs);
    res.status(301).redirect('/home');
    });
    
}]);

router.get('/allblogs', [User.isAuthenticated, function(req, res, next) {
    Blog.find({}, function(err, blogs){
        if(err) throw err;
    if(blogs.length > 0){
        res.render('pages/allblogs', { user: req.user.username, blogs: blogs, message: null });
    } else {
        res.status(301).redirect('/landing');
    }       
    })
}]);

/**************************************/

/********Update User Account************/
router.get('/updateuser', [User.isAuthenticated, function(req, res, next) {
    res.render('pages/setup', { user: req.user.username, messagedrop: null });
}]);

router.post('/updateuser', [User.isAuthenticated, function(req, res, next) {
  
  User.findOneAndUpdate({"_id": req.user._id}, 
    {$set: {
        dateofbirth: req.body.dateofbirth,
        height: req.body.height,
	weight: req.body.weight,
        phonenumber: req.body.phonenumber,
        meansofcontact: req.body.optionsRadios,
        address: {  'streetaddress': req.body.streetaddress,
            'city': req.body.city,
            'region': req.body.region,
            'zip': req.body.zip  }
	},
    $addToSet: {
        preference: {$each:  req.body.preference  }
        }    
    }, { new: true }, function(err, updateduser){
    if(err) throw err;
  req.flash('success', 'Your Action completed successfully.');
  res.render('pages/setup', { user: req.user.username, messagedrop: req.flash('success') });
  })
}]);

/********Update User account Ends*************/

/********Booking************/
router.get('/book', [User.isAuthenticated, function(req, res, next) {
    res.render('pages/booking', { user: req.user.username, messagedrop: null });
}]);

router.post('/book', [User.isAuthenticated, function(req, res, next) {
  var credentials = {'category': req.body.bookcategory, 'username': req.body.username, 'details': req.body.bookdetails, 'datesubmitted': moment().format('YYYY-MM-DD'), 'appointment': req.body.bookappointment};
  //console.log(JSON.stringify(credentials));
  
  Booking.create(credentials, function(err, newBooking){
    if(err) throw err;
  req.flash('success', 'Your Action completed successfully.');
  res.render('pages/booking', { user: req.user.username, messagedrop: req.flash('success') });
  })
}]);

/*******Booking Ends**************/
// Logout
router.get('/logout', function(req, res, next) {
	// remove the req.user property and clear the login session
        var userna = req.user.username;
        Room.findOneAndUpdate({"title": userna }, {$set: {"status" : "end" }}, { new: true }, function(err, room){
            if(err) throw err;
		if(!room){
                    //return next(); 
		}
        });
	req.logout();

	// destroy session data
	req.session = null;

	// redirect to homepage
	res.redirect('/');
});

module.exports = router;