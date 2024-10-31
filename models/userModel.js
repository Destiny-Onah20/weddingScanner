import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
      require: true,
    },
    otpExpiry: {
      type: String,
    },
    token: {
      type: Number,
      unique: true,
    },
    collections: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "collections",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("users", userSchema);
export default User;
