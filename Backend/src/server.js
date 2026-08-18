import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
)

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})