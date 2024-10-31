import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateUserToken = (_id, email ) => {
    const userToken = jwt.sign({
      _id,
      email,
    }, process.env.SECRET_TOKEN)
  
    return userToken;
};
