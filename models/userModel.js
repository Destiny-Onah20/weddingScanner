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
    },
    otpExpiry: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
