const express = require("express");
const router = express.Router();
const Note = require("../models/notes.js");
const { body, validationResult } = require("express-validator");
const checkAuth = require("../validators/token-validator.js");
router.get("/fetchAllNotes", checkAuth, (req, res) => {
  let success = false;
  Note.find({ author: req.userData.userId })
    .then((foundNotes) => {
      success = true;
      res.status(200).json({
        success: success,
        payload: foundNotes,
        message: "All of your notes fetched!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "an error occured while fetching notes!",
        success: success,
      });
    });
});

router.post(
  "/addNotes",
  checkAuth,
  [
    body(
      "title",
      "Title must be a valid more than 3 charecter long entity."
    ).isLength({ min: 3 }),
    body(
      "description",
      "Description must be a valid more than 5 charecter long entity"
    ).isLength({ min: 5 }),
  ],
  (req, res, next) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let message = [];
      errors.array().forEach((error) => {
        message.push(error.msg);
      });
      return res
        .status(400)
        .json({ message: message.toString(), success: success });
    }
    const note = new Note({
      author: req.userData.userId,
      title: req.body.title,
      description: req.body.description,
      tag: req.body?.tag,
    });
    note
      .save()
      .then(() => {
        success = true;
        res.status(200).json({
          message: "Note saved successfully!!!",
          success: success,
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: `an error ${err.message} occured while saving the note`,
          success: success,
        })
      );
  }
);

router.patch("/updateNote/:id", checkAuth, async (req, res, next) => {
  let success = false;
  const { title, description } = req.body;
  const note = await Note.findOne({ _id: req.params.id });
  if (note.author.toString() === req.userData.userId) {
    Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title,
        description: description,
      },
      { new: true }
    )
      .then((updatedData) => {
        success = true;
        res.status(200).json({
          message: "post updated successfully",
          updatedPostData: updatedData,
          success: success,
        });
      })
      .catch((err) =>
        res.status(500).json({
          message: {
            error: `An error occured: ${err.message} while updating the post`,
          },
        })
      );
  } else {
    res.status(400).json({ message: "Not authorised!", success: success });
  }
});
router.delete("/deleteNote/:id", checkAuth, async (req, res) => {
  let success = false;
  console.log(req.params.id);
  const note = await Note.findById(req.params.id);
  if (note.author.toString() === req.userData.userId) {
    Note.findByIdAndDelete(req.params.id)
      .then(() => {
        success = true;
        res.status(200).json({ message: "Note Deleted", success: success });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: `An error ${err.message} occured!!! while deleteing the note `,
          success: success,
        });
      });
  } else {
    res.status(400).json({ message: "Not authorised!", success: success });
  }
});
module.exports = router;
