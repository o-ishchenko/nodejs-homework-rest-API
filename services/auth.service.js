const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const { SECRET_KEY } = require("../helpers/env");
const jwt = require("jsonwebtoken");
const { createError } = require("../helpers/errors");

const registerUser = async (userData) => {
  const result = await User.findOne({ email: userData.email });
  if (result) {
    throw createError(409, "Email in use");
  }

  const password = userData.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Email or password is wrong");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw createError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
    subscription: user.subscription,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
  await User.findByIdAndUpdate(user._id, { token });
  return {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
};

const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
};

const currentUser = async (id) => {
  const user = await User.findById(id);
  return user;
};

const authenticateUser = async (token) => {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const { id } = payload;
    const user = await User.findById(id);
    return user;
  } catch (e) {
    return null;
  }
};

const updateSubscription = async (userId, body) => {
  return await User.findByIdAndUpdate(userId, body, { new: true });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authenticateUser,
  currentUser,
  updateSubscription,
};
