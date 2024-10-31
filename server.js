import dotenv from "dotenv";
dotenv.config();
import app from "./app.js"
import { connectDB } from "./utils/database.js";

const app = express();
const port = process.env.PORT;

app.listen(port, async() => {
    await connectDB();
    console.log(`Server is running on port: ${port}`);
});