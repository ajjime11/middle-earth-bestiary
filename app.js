import express from "express";
import cors from "cors";
import creatureRouter from "./routes/creatureRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/creatures", creatureRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Archival codex listening on port ${PORT}`);
});
