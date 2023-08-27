const mongoose = require("mongoose");
const Joi = require("joi");

const phoneSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    battery: Number,
    camera: Number,
    gaming: Number,
    user_id: String,
  },
  { timestamps: true }
);

exports.PhoneModel = mongoose.model("phones", phoneSchema);

exports.validatePhone = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(300).required(),
    price: Joi.number().min(1).max(99999).required(),
    battery: Joi.number().min(1).max(99).required(),
    camera: Joi.number().min(1).max(99).required(),
    gaming: Joi.number().min(0).max(99).allow(null, ""),
  });
  return joiSchema.validate(_reqBody);
};

exports.validateLoin = (_reqBody) => {
  const joiSchema = Joi.object({
    // email() -> בודק שהמייל שנשלח במאפיין הגיוני למייל
    email: Joi.string().min(2).max(150).email().required(),
    password: Joi.string().min(3).max(16).required(),
  });
  return joiSchema.validate(_reqBody);
};
