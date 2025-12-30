const md5 = require("md5");
const User = require("../../..//models/user.model");
const generateHelper = require("../../../helpers/generate");

//[get] /api/v1/users
module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };
    const users = await User.find(find);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(users);
    // console.log(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//[post /api/v1/users/register]
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  console.log(existEmail);
  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại",
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    user.save();

    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Tạo tài khoản mới thành công",
      token: token,
    });
  }
};

//[post /api/v1/users/login]
module.exports.login = async (req, res) => {};

//[Post] /api/v1/users/password/forgot
// [Post] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {};

//[Post] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {};

//[Post] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {};
//[Get] /api/v1/users/detail
module.exports.detail = async (req, res) => {};
