const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { route, scenario, time, lang } = req.body;

    const languageMap = {
      en: "English",
      hi: "Hindi",
      te: "Telugu"
    };

    const prompt = `
    Explain why this route is best.
    Route: ${route}
    Time: ${time} minutes
    Crowd: ${scenario}
    Respond in ${languageMap[lang] || "English"}.
    Keep it short and helpful.
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Best route based on crowd and time.";

    res.status(200).json({ text });

  } catch (err) {
    res.status(200).json({
      text: "Best route based on crowd and time."
    });
  }
});

module.exports = router;
