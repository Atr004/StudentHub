import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ---------------------------
// REGISTER USER
// ---------------------------
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next({ status: 400, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

// ---------------------------
// LOGIN USER
// ---------------------------
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next({ status: 400, message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next({ status: 400, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// ---------------------------
// GET USER PROFILE
// ---------------------------
export const getProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next({ status: 404, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

export const getAllUsers = async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, users });
};

