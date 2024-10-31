import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/database.js";
import router from "./routers/userRoute.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/user",router)
const port = process.env.PORT;

app.listen(port, async() => {
    await connectDB();
    console.log(`Server is running on port: ${port}`);
});