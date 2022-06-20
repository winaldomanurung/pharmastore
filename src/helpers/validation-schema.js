const Joi = require("joi");

module.exports.addProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(200).required(),
  category: Joi.number().required(),
  stock: Joi.number().required(),
  volume: Joi.number().required(),
  unit: Joi.string().max(10).required(),
  price: Joi.number().required(),
  // picture: Joi.string().max(200).required(),
});

module.exports.editProductSchema = Joi.object({
  name: Joi.string().min(3).max(50).allow(null, ""),
  description: Joi.string().min(3).max(200).allow(null, ""),
  category: Joi.number().allow(null, ""),
  stock: Joi.number().allow(null, ""),
  volume: Joi.number().allow(null, ""),
  unit: Joi.string().max(10).allow(null, ""),
  price: Joi.number().allow(null, ""),
  // picture: Joi.string().max(200).allow(null, ""),
});

module.exports.addCategorySchema = Joi.object({
  name: Joi.string().min(3).max(25).required(),
});

module.exports.editCategorySchema = Joi.object({
  name: Joi.string().min(3).max(25).allow(null, ""),
});

module.exports.loginSchema = Joi.object({
  username: Joi.string().min(8),
  email: Joi.string().email(),
  password: Joi.string()
    .min(8)
    .pattern(/[!@#$%&*_!]/)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .required(),
});

