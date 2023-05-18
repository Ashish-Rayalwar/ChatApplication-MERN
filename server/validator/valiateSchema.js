const Joi = require("joi");

// const { joiPasswordExtendCore } = require('joi-password')
// const JoiPassword = Joi.extend(joiPasswordExtendCore);

const userValidation = Joi.object({
  userName: Joi.string().min(2).max(10).required().lowercase(),
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().max(15).min(7).required(),
  pic: Joi.string(),
});

const loginValidation = Joi.object({
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().max(15).min(7).required(),
});
const adminValidation = Joi.object({
  email: Joi.string().required().email().lowercase(),
  password: Joi.string().max(15).min(7).required(),
  role: Joi.string().required(),
});

const fileValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  fileSize: Joi.string().required(),
  prize: Joi.number().required(),
});

const fileUpdateValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  fileSize: Joi.string(),
  prize: Joi.number(),
  filePath: Joi.string(),
  imgPath: Joi.string(),
});

// const orderValidate = Joi.object({
//     userId :
// })

module.exports = {
  userValidation,
  adminValidation,
  fileValidation,
  fileUpdateValidation,
  loginValidation,
};
