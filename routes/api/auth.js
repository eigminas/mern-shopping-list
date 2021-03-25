const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// Get user model
const User = require("../../models/User");

/**
 * @route POST api/auth
 * @desc Authenticate new user
 * @access Public
 */
router.post("/", (req, res) => {
  // Get email and password from the request body
  const { email, password } = req.body;
  // Email or password not entered
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  // Make sure user exists
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // User does exist. Validate credentials
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      // Credentials valid. Sign JWT
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

/**
 * @route GET api/auth/user
 * @desc Get user data
 * @access Private
 */ 
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
