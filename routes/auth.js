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
    let success = false;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let message = [];
      errors.array().forEach((error) => {
        message.push(error.msg);
      });
      return res
        .status(400)
        .json({ message: message.toString(), success: success });
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
                    success = true;
                    res.status(201).json({
                      userData: user,
                      message: "user saved successfully!",
                      success: success,
                    });
                  })
                  .catch((err) => {
                    res
                      .status(400)
                      .json({ message: err.message, success: success });
                  });
              } else {
                res
                  .status(400)
                  .json({ message: err.message, success: success });
              }
            });
          } else {
            res.status(400).json({ message: err.message, success: success });
          }
        });
      } else {
        res.status(400).json({
          message: "User already exists!",
          success: success,
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
    let success = false;
    errors = validationResult(req);
    if (!errors.isEmpty()) {
      let message = [];
      errors.array().forEach((error) => {
        message.push(error.msg);
      });
      return res
        .status(400)
        .json({ message: message.toString(), success: success });
    }
    if (req.body) {
      console.log(req.body);
      User.findOne({ email: req.body.email })
        .then((founduser) => {
          console.log(founduser);
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
                  name: founduser.name,
                },
                process.env.JWT_SECRET
              );
              success = true;
              res.status(200).json({
                message: "login successfull",
                token: token,
                success: success,
              });
            } else {
              res.status(400).json({
                message: "Password did not match",
                success: success,
              });
            }
          } else {
            res.status(400).json({
              message: "user not found!",
              success: success,
            });
          }
        })
        .catch((err) => {
          res.status(404).json({
            message: err.message,
            success: success,
          });
        });
    } else {
      res.status(400).json({
        message: "invalid data entered",
        success: success,
      });
    }
  }
);
module.exports = router;
