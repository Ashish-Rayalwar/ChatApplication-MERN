const bcrypt = require("bcryptjs");
const { uploadFile } = require("./aws");
const userModel = require("../models/userModel");
let JWT = require("jsonwebtoken");
const {
  userValidation,
  loginValidation,
} = require("../validator/valiateSchema");
const signup = async (req, res) => {
  try {
    let data = req.body;
    let { userName, email, pic, password } = data;
    const responce = await userValidation.validateAsync(data);
    const checkEmailExist = await userModel.findOne({ email: email });

    if (checkEmailExist)
      return res.status(409).json({
        message: "User already exist with this email, try different email",
      });
    const bcryptPass = await bcrypt.hash(data.password, 10);

    let userData = {
      userName,
      email,
      password: bcryptPass,
      profile: pic,
    };

    let createUser = await userModel.create(userData);
    return res.status(201).send(createUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const { email } = data;

    const responce = await loginValidation.validateAsync(data);
    const checkEmailExist = await userModel.findOne({ email: email });
    if (!checkEmailExist)
      return res.status(404).json({ message: "User Not Found" });

    const userPassword = checkEmailExist.password;
    const originalPassword = await bcrypt.compare(data.password, userPassword);

    const userId = checkEmailExist._id;
    const role = checkEmailExist.role;

    if (!originalPassword)
      return res.status(401).json({
        status: false,
        message: "Incorrect password, plz provide valid password",
      });
    const { password, __v, ...rest } = checkEmailExist._doc;

    const token = JWT.sign({ userId: userId, role: role }, process.env.JWTA, {
      expiresIn: 86400,
    });
    // .cookie("token", token, { httpOnly: true, secure: true, sameSite: true })
    return res
      .status(200)
      .send({ message: "Login Success", data: rest, token: token });
  } catch (error) {
    if (error.isJoi == true) error.status = 400;

    console.log("error in loginUser", error.message);
    return res.status(error.status).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    let data = req.query;

    let { search } = data;

    if (!search) {
      let users = await userModel.find();
      if (users.length === 0)
        return res.status(404).json({ message: "no data found" });
      return res.status(200).json({ data: users });
    }

    let users = await userModel.find({
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    if (!users || users.length === 0)
      return res.status(404).json({ message: "no data found" });
    return res.status(200).json({ data: users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

module.exports = { signup, loginUser, getUsers };
