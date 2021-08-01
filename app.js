//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require ("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");

//md5 is the used for hashing passwords.
// const md5 = require("md5");

//bcrypt is a library used to hash passwords and also helps with salting of passwords.
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//here we are creating a proper mongoose schema by using the function with mongoose package.
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = "ThisIsOurLittleSecret.";

/*plugins are extra bit of packaged code that we can add to mongoose schemas to extend their functionality or give them more power essentially. encryptedFields is used to encrypt specific fields and not all of the object. If we want to add more fields then we can add that to the array [a,b,c]. */

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']} );

/* It's important to add the plugin to the schema before creating the mongoose model, because we're parsing in the user schema as a parameter to create our new Mongoose Model. */

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
}); 


app.post("/register", function(req, res){
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
            // password: md5(req.body.password) used with md5
        });
    
        newUser.save(function(err){
            if (err)
                console.log(err);
            
            else    
                res.render("secrets");
        });
    });

});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    // const password = md5(req.body.password); //used with md5

    User.findOne({email: username}, function(err, foundUser){
        if (err)
            console.log(err);

        else    
        {
            if(foundUser)
            {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true)
                        res.render("secrets");
                });

                // if (foundUser.password === password)
                //     res.render("secrets");
            }
        }
    });

});




app.listen(3000, function() {
    console.log("Server started on port 3000");
});