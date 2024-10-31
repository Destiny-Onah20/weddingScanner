import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/database.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.listen(port, async() => {
    await connectDB();
    console.log(`Server is running on port: ${port}`);
});