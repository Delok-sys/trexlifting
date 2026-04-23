import express from "express";

const PORT = 3001;
const app = express();

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/demo-message", (request, response) => {
  response.json({
    message: "Hallo aus dem Demo-Backend. Die Verbindung funktioniert.",
  });
});

app.use((request, response) => {
  response.status(404).json({ message: "Route nicht gefunden." });
});

app.listen(PORT, () => {
  console.log(`Demo backend running on http://localhost:${PORT}`);
});
