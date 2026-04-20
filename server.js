const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// API route
app.use("/api", require("./api/gemini"));

// Serve static files
app.use(express.static(__dirname));

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
