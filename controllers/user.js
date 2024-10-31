import User from "../models/userModel.js";
import jsonwebtokenwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateUserToken } from "../utils/jwt.js";
import { sendMail } from "../helper/mail.js";

export const signUp = async (req, res) => {
  try {
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: `please enter email and password`,
      });
    }
    const checkEmail = await User.findOne({ email: email.toLowerCase() });
    if (!checkEmail) {
      return res.status(400).json({
        message: `email already exist`,
      });
    }
    const saltPassword = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltPassword);
    // Generate and Hash OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const user = new User({
      email: email.toLowerCase(),
      password: hashPassword,
      otp,
      otpExpiry,
    });
    await user.save();

    await sendMail({
      subject: "Kindly Verify Your Email",
      email: user.email,
      text: `Your OTP code is: ${otp}`,
      html: signUpTemplate(user.email, otp),
    });

    res.status(201).json({
      message: `Welcome ${user.email}. Kindly check your email for the verification link and OTP.`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: `error trying to process your request`,
    });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "Missing OTP in request body." });
    }

    const user = await User.findOne({ otp: otp.toString() }); // Assuming you compare hashed OTPs

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // Check OTP expiry
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
      // Resend OTP
      const newOTP = generateOTP();
      const hashedNewOTP = await bcrypt.hash(newOTP, 10);
      user.otp = hashedNewOTP;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      await sendMail({
        subject: "OTP Resend",
        email: user.email,
        text: `Your new OTP code is: ${newOTP}`,
        html: resendOTPTemplate(user.firstName, newOTP),
      });

      return res.status(200).json({
        message: "OTP has expired. A new OTP has been sent to your email.",
      });
    }

    // OTP verified successfully
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
         message: "An error occurred while verifying OTP." ,
         error:error.message
        });
  }
};

export const login = async (req,res) => {
  try {
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({
            message:`please enter email and password`
        })
    }
    const user=await User.findOne({email:email.toLowerCase()})
    if(!user){
        return res.status(404).json({
            message:`user not found `
        })
    }
    const checkPassword=await bcrypt.compare(password,user.password)
    if(!checkPassword){
        return res.status(404).json({
            message:`incorrect password`
        })
    }
    const token=generateUserToken(user._id,user.email)
    res.status(200).json({
        message:`login successful`,
        data:token
    })
  } catch (error) {
    res.status(500).json({
        message: "An error occurred trying to login." ,
        error:error.message
       });
  }
};


export const createAnEvent = async (req, res) => {
  try {
    const { name, type } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const eventData = {
      eventName: name,
      eventType: type,
      user_id: req.user._id,
    };
    const event = await Event.create(eventData);
    return {
      message: "success",
      data: event
    }
  } catch (error) {
    res.status(500).json({
      message: error.message ,
      error:error.message
     });
  }
};

export const shareEventLink = async (req, res) => {

};
