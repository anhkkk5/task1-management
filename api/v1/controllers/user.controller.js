const md5 = require("md5");
const User = require("../../..//models/user.model");
const generateHelper = require("../../../helpers/generate");
const ForgotPassword = require("../../../models/forgot-password.model");
const senMailHelper = require("../../../helpers/sendMail");
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
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }
  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu !",
    });
  } else {
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: token,
    });
  }

  console.log(user);
};

//[Post] /api/v1/users/password/forgot
// [Post] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại !",
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);
  const timeExpire = 3;
  //lưu data vào database
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60,
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  //Gưi otp qua email user
  console.log(objectForgotPassword);

  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>
    (Sử dụng trong ${timeExpire} phút). Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
  `;

  senMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    message: "Đã gửi mã otp qua email",
  });
};

//[Post] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    res.json({
      code: 400,
      message: "Mã otp không hợp lệ",
    });
    return;
  }

  const user = await User.findOne({
    email: email,
  });
  const token = user.token;
  res.cookie("token", token);
  console.log(email, otp);

  res.json({
    code: 200,
    message: "Xác thực thành công",
    token: token,
  });
};

//[Post] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.cookies.token;
  const password = req.body.password;

  const user = await User.findOne({
    token: token,
  });

  if (md5(password) === user.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu khác mật khẩu cũ",
    });
    return;
  }

  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(password),
    }
  );

  res.json({
    code: 200,
    message: "Đổi mk thành công",
  });
};
//[Get] /api/v1/users/detail
module.exports.detail = async (req, res) => {};
