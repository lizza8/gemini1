import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MINDTRACE_SYSTEM_PROMPT } from "./mindtraceSystemPrompt.js";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: MINDTRACE_SYSTEM_PROMPT,
  generationConfig: {
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 4096,
    responseMimeType: "application/json"
  }
});
