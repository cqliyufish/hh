// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// const md5 = require("md5");

// const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userdb");
const app = express();
// console.log(md5('message'));

// console.log(process.env.SECRET);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
///////////////////////////////////// add mongoose encryption///////////////////////
// var secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model("user", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if(err){
        console.log(err);
      }else {
        res.render("secrets");
      }
    })

     });
});

app.post("/login", function(req, res) {
  User.findOne({email: req.body.username}, function(err, foundItem) {
    if(err){
      console.log(err);
    }else{
      if(foundItem){
        bcrypt.compare(req.body.password, foundItem.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
});

      }
    }
  });
});


app.listen(3000, function(req, res) {
  console.log("3000 is working");
});
