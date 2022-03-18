const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userdb");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
///////////////////////////////////// add encryption///////////////////////
var secret = "thisisscerete";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if(err){
      console.log(err);
    }else {
      res.render("secrets");
    }

  })
});

app.post("/login", function(req, res) {
  User.findOne({email: req.body.username}, function(err, foundItem) {
    if(err){
      console.log(err);
    }else{
      if(foundItem){
        if(foundItem.password === req.body.password){
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3000, function(req, res) {
  console.log("3000 is working");
});
