var bodyParser = require('body-parser');
var multer = require('multer');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var app = express();

var connectionString = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/sociali';
mongoose.connect(connectionString);

app.use(express.static(__dirname + '../../public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(session({ secret: 'secret string' }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());// do not ask everytime for user credentials, check in session for username and password

//To check the server process env
//app.get('/process', function (req, res) {
//    res.json(process.env);
//});

//  Set the environment variables
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.listen(port, ip);

/*Method to send mail*/
app.post("/api/sendMail", function (req, res) {
    var toMail = req.body.email;
    var senderName = req.body.name;
    console.log(toMail);
    var auth = {
        auth: {
            api_key: 'key-f7eeef970cdedbdfd659aaa56e6cec27',
            domain: 'sandbox428b7233e69d40cbba8b5eb6b9ed57fd.mailgun.org'
        }
    };
    var transporter = nodemailer.createTransport(mg(auth));

    var mailOptionsForSender = {
        from: 'Sociali support <endeavorprj@gmail.com>',
        to: senderName + '<' + toMail + '>',
        subject: "Query submitted:" + req.body.subject,
        text: "Your query is submitted.\n\nQuery submitted: " + req.body.message + "\n\nSender Details: \nName: " + senderName + "\nEmail: " + toMail + "\n", // plaintext body
        //html: 'Hello&nbsp;<b>'+sender+'</b> <br/> Your query is submitted.<br/><br/> <b>Query submitted:</b> <br/> <p>' + req.body.message + '</p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptionsForSender, function (error, info) {
        if (error) {
            console.log(error, "Error in sending mail to sender");
        } else {
            console.log('Message sent to sender' + info);
        }
    });

    var mailOptions = {
        from: 'Sociali support <endeavorprj@gmail.com>',
        to: 'Sociali support <endeavorprj@gmail.com>',
        subject: req.body.subject,
        text: "Query submitted: " + req.body.message + "\n\nSender Details: \nName: " + senderName + "\nEmail: " + toMail + "\n", // plaintext body
        //html: '<b>Hello</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error, "Error in sending mail to support");
        } else {
            console.log('Message sent: ');
            res.send(200);
        }
    });

});


/**********DB data and functions START**********/
var UserLoginSchema = new mongoose.Schema({
    username: {type:String,index:{unique:true}},
    password: String,
    role: { type: String, default: 'Member' },
}, { collection: "userLogin" });

var UserDetailsSchema = new mongoose.Schema({
    username: {type:String,index:{unique:true}},
    firstName: String,
    lastName: String,    
    email: String,
    phone: String,
    dob: { type: Date, default: Date.now }
}, { collection: "userDetails" });

var PreferenceSchema = new mongoose.Schema({
    username: {type:String,index:{unique:true}},
    preferences: String
}, { collection: "preferences"});


var UserLoginModel = mongoose.model("UserLogin", UserLoginSchema);
var UserDetailsModel = mongoose.model("UserDetails", UserDetailsSchema);
var PreferencesModel = mongoose.model("Preferences", PreferenceSchema);

var initialUserLogin = new UserLoginModel({
    username: "admin",
    password: "admin",
    role: "Admin"
});
var initialUserDetails = new UserDetailsModel({
    username: "admin",
    firstName: "admin",
    lastName: "admin",
    email: "admin@email.com",
    phone: "123-456-7890",
    dob: Date.now
});

//initialUserLogin.save();
//initialUserDetails.save();



/*********User related functions**********/
//Find all users
app.get("/api/user", function (req, res) {
    UserLoginModel.find(function (err, data) {
        res.json(data);
    });
});

//Adds one user
app.post("/api/userDetails", function (req, res) {
    //console.log(req.body);
    var userDetails = new UserDetailsModel(req.body);
    //console.log(userDetails);
    userDetails.save(function (err, doc) {
        UserDetailsModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Adds user login
app.post("/api/userLogin", function (req, res) {
    var userLogin = new UserLoginModel(req.body);
    userLogin.save(function (err, doc) {
        UserLoginModel.find(function (err, data) {
            res.json(data);
        });
    });
});


//fetch user details
app.get("/api/findUserDetails/:id", function (req, res) {
    UserDetailsModel.findOne({ username: req.params.id},function (err, data) {
        res.json(data);
    });
});

//update user details
app.post("/api/updateUserDetails/:id", function (req, res) {
    var userDetails = new UserDetailsModel(req.body);
    userDetails.username = req.params.id;
    UserDetailsModel.findOneAndUpdate({ username: req.params.id},req.body,
        function (err, data) {
        res.send(data);
    });
});

//fetch user preferences
app.get("/api/findUserPreferences/:id", function (req, res) {
    PreferencesModel.findOne({ username: req.params.id},function (err, data) {
        res.json(data);
    });
    console.log("service response : " + res.data);
});

//update user preferences
app.post("/api/updateUserPreferences/:id", function (req, res) {
    var preferences = new PreferencesModel(req.body);
    preferences.username = req.params.id;
    PreferencesModel.findOneAndUpdate({ username: req.body.username},req.body,{upsert: true},
        function (err, data) {
            res.send(data);
        });
});

//Update a user login
app.put("/api/userLogin/:id", function (req, res) {
    //console.log(req.params.id);
    //console.log(req.body.username);
    //console.log(req.body.password);
    UserLoginModel.update({ _id: req.params.id }, { $set: { username: req.body.username, password: req.body.password } }, function (err, doc) {
        UserLoginModel.find(function (err, data) {
            res.json(data);
        });
    });
});

//Delete one user
app.delete("/api/deleteUser/:id", function (req, res) {
    UserLoginModel.findById(req.params.id, function (err, doc) {
        var currentUsername = doc.username;
        doc.remove();
        UserDetailsModel.findOne({ username: currentUsername }, function (err, doc) {
            doc.remove();
            PreferencesModel.find({ username: currentUsername }, function (err, docs) {
                if (docs) {
                    console.log(docs.length);
                    if (docs.length > 0)
                        docs.remove();
                }
                res.json({msg: "deleted"});
            });
        });
    });
});




/*****************Passport related functions****************************/
passport.use(new LocalStrategy(
    function (username, password, done) {
        UserLoginModel.findOne({ username: username, password: password }, function (err, user) {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post("/api/login", passport.authenticate('local'),
    function (req, res) { // once user is authenticated by passport it puts the user object in req 
        var user = req.user;
        res.json(user);
    });

app.post("/api/logout", function (req, res) {
    req.logout();
    res.send(200);
});

app.get("/api/loggedin", function (req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

/*var TrackSchema = new mongoose.Schema({
    name: String,
    id: String,
    preview_url: String,
    external_url: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "track" });

var AlbumSchema = new mongoose.Schema({
    name: String,
    id: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "album" });

var ArtistSchema = new mongoose.Schema({
    name: String,
    id: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "artist" });

var CommentSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    lastName: String,
    commentText: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "comment" });

var PlaylistSchema = new mongoose.Schema({
    name: String,
    tracks: [TrackSchema],
    comments: [CommentSchema],
    publish: { type: Boolean, default: 'false' },
    userId: String,
    addedOn: { type: Date, default: Date.now }
}, { collection: "playlist" });

var FollowerSchema = new mongoose.Schema({
    playlistId: String,
    followerUserId: String
}, { collection: "follower" });

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    role: { type: String, default: 'Member' },
    email: String,
    phone: String,
    tracks: [TrackSchema],
    albums: [AlbumSchema],
    artists: [ArtistSchema]
}, { collection: "user" });

var UserModel = mongoose.model("User", UserSchema);

var initialUser = new UserModel({
    username: "admin",
    password: "admin",
    firstName: "admin",
    lastName: "admin",
    role: "Admin",
    email: "kakkar.j@husky.neu.edu",
    phone: "123-456-789",
    tracks: [], albums: [], artists: []
})

//initialUser.save();*/

