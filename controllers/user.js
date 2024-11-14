import QRCode from "qrcode";
import User from "../models/userModel.js";
import Event from "../models/event.model.js";
import bcrypt from "bcrypt";
import { generateUserToken } from "../utils/jwt.js";
import { sendMail } from "../helper/mail.js";
import { signUpTemplate } from "../helper/template.js";
import Cloudinary from "../utils/cloudinary.js";

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
    if (checkEmail) {
      return res.status(400).json({
        message: `User with this email already exists.`,
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
      otp: otp,
      otpExpiry: otpExpiry,
    });

    await user.save();
    await sendMail({
      subject: "Kindly Verify Your Email",
      email: user.email,
      html: signUpTemplate(user.email, otp),
    });

    res.status(201).json({
      message: `Welcome ${user.email}. Kindly check your email for the verification link and OTP.`,
    });
  } catch (error) {
    if (error.code === 11000) {
      const whatWentWrong = Object.keys(error.keyValue)[0];
      return res.status(500).json({
        message: `A user with this ${whatWentWrong} exists.`,
      });
    } else {
      res.status(500).json({
        message: "An error occurred while processing your request.",
        errorMessage: error.message,
      });
    }
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "please input otp." });
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
      message: "An error occurred while verifying OTP.",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: `please enter email and password`,
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: `user not found `,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({
        message: `incorrect password`,
      });
    }
    const token = generateUserToken(user._id, user.email);
    res.status(200).json({
      message: `login successful`,
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred trying to login.",
      error: error.message,
    });
  }
};
export const oneUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      return res.status(404).json({
        message: `user not found`,
      });
    }
    res.status(200).json({
      message: `get me this user`,
      data: checkUser,
    });
  } catch (error) {
    res.status(500).json({
      message: `error trying to get this user`,
      errorMessage: error.message,
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
      name: name,
      event_type: type,
      user: req.user._id,
    };
    const event = await Event.create(eventData);

    return res.status(200).json({
      message: "success",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

export const shareEventLink = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { emails } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    if (!event.link) {
      return res.status(404).json({
        message: "Event link not found, please create an event link first",
      });
    }
    const link = event.link;
    if (!Array.isArray(emails) || emails.length === 0) {
      return res
        .status(400)
        .json({ error: "Emails must be a non-empty array." });
    }
    const invalidEmails = emails.filter(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (invalidEmails.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid email(s): ${invalidEmails.join(", ")}` });
    }
    await Promise.all(
      emails.map(async (email) => {
        await sendMail({
          subject: `You have been invited to this event: ${event.name}`,
          email: email,
          html: signUpTemplate(email, link),
        });
      })
    );
    res.status(200).json({
      message: "links shared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

export const generateWeddingLink = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    const link = `https://guest-imageupload.vercel.app/#/upload/${event._id}`;
    const qrcode = await QRCode.toDataURL(link);
    const base64Code = qrcode.split(",")[1];

    const result = await Cloudinary.uploader.upload(qrcode);

    await Event.updateOne(
      {
        _id: eventId,
      },
      {
        qrcode: result.secure_url,
        link,
      }
    );

    return res.status(200).json({
      message: "success",
      data: {
        code: result.secure_url,
        link,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

export const getOneEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate("collections");
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    return res.status(200).json({
      message: "success",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};
export const getAllEvent = async (req, res) => {
  try {
    const userId = req.params.user;
    const allEvent = await Event.find({ user: userId });
    console.log(allEvent, "USERID");

    if (allEvent.length === 0) {
      return res.status(404).json({
        message: `no event found`,
      });
    }
    res.status(200).json({
      message: `here are all ${allEvent.length} events `,
      data: allEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.message,
    });
  }
};

export const AllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(400).json({
        message: `no user found`,
      });
    }
    res.status(200).json({
      message: `get all the ${users.length}`,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving events.",
      error: error.message,
    });
  }
};
