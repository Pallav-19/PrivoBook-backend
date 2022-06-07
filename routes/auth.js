const express = require("express");
const router = express.Router();
const User = require("../models/auth/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");
router.post(
  "/signup",
  [
    body(
      "name",
      "enter a valid name which is atleast 3 character long"
    ).isLength({ min: 3 }),
    body("email", "enter a valid email address").isEmail(),
    body("password", "password must contain 5 characters atleast.").isLength({
      min: 5,
    }),
  ],
  (req, res, next) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.findOne({ email: req.body.email }, (founUser) => {
      if (!founUser) {
        bcryptjs.genSalt(10, function (err, salt) {
          if (!err) {
            bcryptjs.hash(req.body.password, salt, function (err, hash) {
              if (!err) {
                User.create({
                  name: req.body.name,
                  password: hash,
                  email: req.body.email,
                })
                  .then((user) => {
                    res.status(201).json({
                      userData: user,
                      message: "user saved successfully!",
                    });
                  })
                  .catch((err) => {
                    res.status(400).json({ message: err.message });
                  });
              } else {
                console.log(err.message);
              }
            });
          } else {
            console.log(err.message);
          }
        });
      } else {
        res.status(400).json({
          message: "User already exists!",
        });
      }
    });
  }
);

router.post(
  "/login",
  [
    body("email", "enter a valid email!").isEmail(),
    body("password", "password cannot be blank!").exists(),
  ],
  (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body) {
      User.findOne({ email: req.body.email }, (founduser) => {
        if (founduser) {
          let comparison = bcryptjs.compare(
            req.body.password,
            founduser.password
          );
          if (comparison) {
            const token = jwt.sign(
              {
                userId: founduser._id,
                email: founduser.email,
                password: founduser.password,
                name: founduser.name,
              },
              process.env.JWT_SECRET
            );
            res.status(200).json({
              message: "login successfull",
              token: token,
            });
          } else {
            res.status(400).json({
              message: "Password did not match",
            });
          }
        } else {
          res.status(400).json({
            message: "user not found!",
          });
        }
      });
    } else {
      res.status(400).json({
        message: "invalid data entered",
      });
    }
  }
);
module.exports = router;
