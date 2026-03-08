import express from "express";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
//import { hashPassword } from "../HashPassword.js";
const Router = express.Router();
Router.get("/checker", (req, res) => {
  return res.status(200).send("cron done successffully");
});
Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email or Password is required" });

    const checkExistence = await User.findOne({ email: email });
    if (!checkExistence)
      return res.status(400).json({ message: `Invalid Credentials` });

    const isPasswordMatch = await checkExistence.ComparePasswords(password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ checkExistence }, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return res.status(200).json({
      token: token,
      user: {
        id: checkExistence._id,
        username: checkExistence.username,
        email: checkExistence.email,
        password: checkExistence.password,
        profileImage: checkExistence.profileImage,
      },
    });
  } catch (error) {
    console.log("Error in querying user", error);
  }
});

Router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "Fields are required" });
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password length less than 6" });
    }

    if (username.length < 3) {
      res
        .status(400)
        .json({ message: "Username must be atleast 3 characters long" });
    }
    const checkExistence = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (checkExistence) {
      res.status(400).json({ message: "User already exist" });
    }
    // const hashedPassword = hashPassword(password);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const user = new User({
      username: username,
      email: email,
      password: password,
      profileImage: avatar,
    });
    await user.save();

    if (user) {
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "15d",
      });
      res.status(200).json({
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          password: user.password,
          profileImage: user.profileImage,
        },
      });
    }
  } catch (error) {
    console.log("Error in Saving Data", error);
  }
});

export default Router;
