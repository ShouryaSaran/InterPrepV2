import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import resumeRoutes from "./Routes/resumeRoutes.js";
import analysisRoutes from "./Routes/analysisRoutes.js";
import roadmapRoutes from "./Routes/roadmapRoutes.js";
import consultantRoutes from "./Routes/consultantRoutes.js";
import interviewRoutes from "./Routes/interviewRoutes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Mount Routes
app.use("/api/resumes", resumeRoutes);
app.use("/api/analyses", analysisRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/consultant", consultantRoutes);
app.use("/api/interviews", interviewRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})