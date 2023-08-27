const express = require("express");
const { validateBook, BooksModel } = require("../models/booksModel");
const { auth } = require("../middlewares/aute");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filteFind = {};
    // בודק אם הגיע קווארי לחיפוש
    if (req.query.s) {
      const searchExp = new RegExp(req.query.s, "i");
      filteFind = { name: searchExp };
    }
    const data = await BooksModel.find(filteFind)
      .limit(limit)
      .skip(page * limit)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// הוספת רשומה חדשה
router.post("/", auth, async (req, res) => {
  // בדיקה שהבאדי תקין
  const validBody = validateBook(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const book = new BooksModel(req.body);

    book.user_id = req.tokenData._id;
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  //   const book = new BooksModel(req.body);
  //   console.log(req.tokenData._id);
  //   console.log(book.user_id);
  //   if (req.tokenData._id != book.user_id) {
  //     return res.status(400).json({ msg: "You are not allowed to delete" });
  //   }
  try {
    const _id = req.params.id;
    //user_id: req.tokenData._id - בדיקה שרק בעל הרשומה יוכל למחוק אותה
    const data = await BooksModel.deleteOne({
      _id,
      user_id: req.tokenData._id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.put("/:id", auth, async (req, res) => {
  const validBody = validateBook(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const _id = req.params.id;
    //user_id: req.tokenData._id - בדיקה שרק בעל הרשומה יוכל למחוק אותה
    const data = await BooksModel.updateOne(
      { _id, user_id: req.tokenData._id },
      req.body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
