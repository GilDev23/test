const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema(
  {
    name: String,
    genere: String,
    pages: Number,
    price: Number,
    user_id: String,
  },
  { timestamps: true }
);

exports.BooksModel = mongoose.model("books", bookSchema);

exports.validateBook = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(300).required(),
    genere: Joi.string().min(1).max(300).required(),
    pages: Joi.number().min(1).max(99999).required(),
    price: Joi.number().min(1).max(99999).required(),
  });
  return joiSchema.validate(_reqBody);
};
