const authService = require("../services/auth.service");
const { uploadImage } = require("../services/image.service");
const emailService = require("../services/email.service");
const {
  schemaRegister,
  schemaLogin,
  schemaUpdate,
  schemaResendVerification,
} = require("../models/user");

const registerUser = async (req, res, next) => {
  try {
    const { error } = schemaRegister.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Ошибка от Joi или другой библиотеки валидации",
      });
      return;
    }
    const user = await authService.registerUser(req.body);
    await emailService.sendEmail(user.email, user.verificationToken);
    res.status(201).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    });
  } catch (e) {
    next(e);
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    const user = await authService.findUser({ verificationToken });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    await authService.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });
    return res.status(200).json({
      code: 200,
      message: "Verification successful",
    });
  } catch (e) {
    next(e);
  }
};

const resendVerifyUser = async (req, res, next) => {
  try {
    const { error } = schemaResendVerification.validate(req.body);
    if (error) {
      console.log(error);
      res.status(400).json({
        message: "Error from Joi: missing required field email",
      });
      return;
    }
    const { email } = req.body;
    const user = await authService.findUser({ email });
    console.log(user);
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verify) {
      res.status(404).json({
        message: "Verification has already been passed",
      });
    }
    await emailService.sendEmail(user.email, user.verificationToken);
    return res.status(200).json({
      code: 200,
      message: "Verification email sent",
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { error } = schemaLogin.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Ошибка от Joi или другой библиотеки валидации",
      });
      return;
    }
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const user = await authService.currentUser(req.user._id);
    if (!user) {
      res.status(401).json({
        message: "Not authorized",
      });
      return;
    }
    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (e) {
    next(e);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { error } = schemaUpdate.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Missing field subscription or invalide type of subscription",
      });
      return;
    }
    const { userId } = req.params;
    const user = await authService.updateUser(userId, req.body);
    if (!user) {
      res.status(404).json({
        message: "Not Found",
      });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const avatarURL = await uploadImage(id, req.file);
    await authService.updateUser(id, { avatarURL });

    res.json({ avatarURL });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  uploadAvatar,
  verifyUser,
  resendVerifyUser,
};
