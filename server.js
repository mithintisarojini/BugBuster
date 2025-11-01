import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.AIzaSyBdMZhWe5Wuwl63JQEAQCpK-Hd4l9OL2FE);

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const answer = result.response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI request failed." });
  }
});

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
