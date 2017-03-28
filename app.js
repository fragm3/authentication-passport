var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")
    
var app = express();
    
mongoose.connect("mongodb://localhost/auth_demo_app");

// require the express session and run the session with the 3 parameters

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Rusty is the best",
    resave: false,
    saveUninitialized: false
}));
    
// to set up passport
 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn ,function(req,res){
    res.render("secret");

})

app.get("/register", function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        // if err, redirect to register page
        if(err){
            console.log(err);
            return res.render('register')
        } 
        
        // if no error, then authenticate
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
    });
})

app.get("/login", function(req,res){
    res.render("login");
})


app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
})   ,function(req,res){
});

app.get("/logout", function(req,res){
    req.logout(); // no transaction in database
    
    res.redirect("/"); 
})

function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next; // next refers to the route of secret (callback function)
    }
    res.redirect("/login")
    
}
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!")
})