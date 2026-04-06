const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from build/ first (including resume.pdf)
app.use(express.static(path.join(__dirname, "build")));

// SPA fallback — only for routes that didn't match a static file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
