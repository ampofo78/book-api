import * as Bcrypt from "bcrypt";
import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await Bcrypt.genSalt(10);
  this.password = await Bcrypt.hash(this.password, salt);
});

userschema.methods.ComparePasswords = async function (password) {
  return await Bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userschema);
export default User;
