const express = require("express");
const router = express.Router();
const Note = require("../models/notes.js");
const { body, validationResult } = require("express-validator");
const checkAuth = require("../validators/token-validator.js");
router.get("/fetchAllNotes", (req, res) => {
  Note.find({ user: req.user.id })
    .then((foundNotes) => {
      res.status(200).json({ payload: foundNotes, message: "notes found!" });
    })
    .catch((err) => {
      res.status(500).json({
        message: "an error occured : " + err,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
        res.status(200).json({
          message: "Note saved successfully!!!",
        });
      })
      .catch((err) =>
        res.status(500).json({ message: `an error ${err} occured` })
      );
  }
);

router.patch("/updateNote/:id", checkAuth, (req, res, next) => {
  const { title, description } = req.body;
  const note = findById(req.params.id);
  if (note.author.toString() === req.userData.userId) {
    Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title,
        description: description,
      },
      { new: true }
    )
      .then((updatedData) =>
        res.status(200).json({
          message: "post updated successfully",
          updatedPostData: updatedData,
        })
      )
      .catch((err) =>
        res.status(500).json({
          message: {
            error: `An error occured: ${err}`,
          },
        })
      );
  } else {
    res.status(400).json({ message: "Not authorised!" });
  }
});
router.delete("deleteNote/:id", checkAuth, (req, res) => {
  const note = Note.findById(req.params.id);
  if (note.author.toString() === req.userData.userId) {
    Note.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(200).json({ message: "Note Deleted" });
      })
      .catch((err) =>
        res.status(400).json({ message: `An error ${err} occured!!!` })
      );
  } else {
    res.status(400).json({ message: "Not authorised!" });
  }
});
module.exports = router;
