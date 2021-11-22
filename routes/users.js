var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");

// login endpoint
router.post("/login", function(req, res) {
  // assume user sends user/pw in request body
  // (should use db to get user information )
  let username = req.body.username;
  let password = req.body.password;
  let secret = process.env.JWT_SECRET || "hello";
  if (username == "user" && password == "pw") {

    // first arg: users object with information that you want to use later for auth purposes
    // second arg: secret used to encrypt the jwt token
    var token = jwt.sign({
      username: "user",
      isAdmin: false
    }, secret);

    res.json({token});

  } else {

    res.status(401).json({
      message: "authentication failed"
    });

  }
});


/* GET users listing. */
router.get('/', async function(req, res, next) {
  let db_collection_name = req.app.locals.db_collection;
  let users = await req.app.locals.db.collection(db_collection_name);

  res.json( await users.find().toArray() );

});

module.exports = router;