import express from "express";
import swaggerUi from "swagger-ui-express"
import cors from "cors";
import fileUpload from "express-fileupload";
import swaggerSpec from "./utils/docs.setup.js";
import router from "./routers/userRoute.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use(fileUpload({
    useTempFiles: true
}));

app.get("/", (req, res)=>{
    res.json({
        message: "Welcome to Wedding planner"
    })
});

app.use("/api/v1", router);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
