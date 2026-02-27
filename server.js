import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import router from "./src/controller/routes.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "node_modules", "bootstrap", "dist"))
);

// Routes
app.use("/", router);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});