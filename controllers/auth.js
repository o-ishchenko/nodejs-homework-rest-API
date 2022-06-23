const authService = require("../services/auth.service");
const { uploadImage } = require("../services/image.service");
const { schemaRegister, schemaLogin, schemaUpdate } = require("../models/user");

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
    res.status(201).json({
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
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
};
