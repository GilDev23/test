const express = require("express");
const {
  PhoneModel,
  validatePhone,
  validateLoin,
} = require("../models/phoneModel");
const { auth } = require("../middlewares/aute");
const router = express.Router();

// phones?limit=&page=&sort=&reverse=
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
    const data = await PhoneModel.find(filteFind)
      .limit(limit)
      .skip(page * limit)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await PhoneModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// הוספת רשומה חדשה
router.post("/", auth, async (req, res) => {
  // בדיקה שהבאדי תקין
  const validBody = validatePhone(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const phone = new PhoneModel(req.body);

    phone.user_id = req.tokenData._id;
    await phone.save();
    res.status(201).json(phone);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await PhoneModel.deleteOne({ _id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.put("/:id", auth, async (req, res) => {
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const _id = req.params.id;
    const data = await PhoneModel.updateOne({ _id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
// router.post("/login", async(req,res) => {
//   const validBody = validateLogin(req.body)
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details);
//   }
//   try{
//     // נבדוק אם המייל של המשתמש בכלל קיים במערכת
//     const user = await UserModel.findOne({email:req.body.email});
//     if(!user){
//       return res.status(401).json({err:"Email not found!"});
//     }
//     // נבדוק אם הסיסמא שמהבאדי תואמת לסיסמא המוצפנת ברשומה שמצאנו עם המייל
//     const validPass = await bcrypt.compare(req.body.password, user.password)
//     if(!validPass){
//       return res.status(401).json({err:"Password not match"});
//     }
//     res.json({msg:"You loggend, need to send you token"})
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })
module.exports = router;
