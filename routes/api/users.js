const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// Get user model
const User = require("../../models/User");

/**
 * @route POST api/users
 * @desc Register new user
 * @access Public
 */
router.post("/", (req, res) => {
  // Get data from the request body
  const { name, email, password } = req.body;
  // Check if all fields are entered
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Make sure such user does not already exist
  User.findOne({ email }).then((user) => {
    // User exists
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // User does not exist. Create a new user.
    const newUser = new User({
      name,
      email,
      password,
    });

    // Create salt & hash for password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;

              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
