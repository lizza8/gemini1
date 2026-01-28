import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { model } from "./geminiClient.js";

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));

const cognitiveState = [];

const tryParseJson = (text) => {
  try {
    return { data: JSON.parse(text), error: null };
  } catch (error) {
    return { data: null, error };
  }
};

app.post("/reason", async (req, res) => {
  try {
    const { input, modality = "text" } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Missing input" });
    }

    cognitiveState.push({
      role: "user",
      parts: [{ text: `[${modality.toUpperCase()} INPUT]\n${input}` }]
    });

    const result = await model.generateContent({ contents: cognitiveState });
    const responseText = result.response.text();
    const { data, error } = tryParseJson(responseText);

    cognitiveState.push({
      role: "model",
      parts: [{ text: responseText }]
    });

    if (error) {
      return res.status(502).json({ error: "Model returned invalid JSON" });
    }

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Reasoning failure" });
  }
});

app.post("/counterfactual", async (req, res) => {
  try {
    const { assumptionId, modification } = req.body;
    if (!assumptionId || !modification) {
      return res.status(400).json({ error: "Missing assumptionId or modification" });
    }

    const command = [
      "Apply a counterfactual modification.",
      "",
      `Assumption ID: ${assumptionId}`,
      `Modification: ${modification}`,
      "",
      "Recompute reasoning graph strictly per system rules."
    ].join("\n");

    cognitiveState.push({
      role: "user",
      parts: [{ text: command }]
    });

    const result = await model.generateContent({ contents: cognitiveState });
    const responseText = result.response.text();
    const { data, error } = tryParseJson(responseText);

    cognitiveState.push({
      role: "model",
      parts: [{ text: responseText }]
    });

    if (error) {
      return res.status(502).json({ error: "Model returned invalid JSON" });
    }

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Counterfactual failure" });
  }
});

app.listen(3001, () => {
  console.log("🧠 MINDTRACE Cognitive Engine running on :3001");
});
