import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import corsOptions from "./config/corsOptions.js"; // ✅ named import

// import { corsOptions } from "./config/corsOptions.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import songRoutes from "./routes/songRoutes.js";

dotenv.config();
const app = express();

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.send("Song-Manager API is running...");
});

app.use("/song", songRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
