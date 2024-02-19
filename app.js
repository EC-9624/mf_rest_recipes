import dotenv from "dotenv";
import express from "express";
import { createConnection } from "mysql2/promise";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

let connection;

async function connectDb() {
  try {
    connection = await createConnection(process.env.DATABASE_URL);
    console.log("Connected to PlanetScale!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

connectDb();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/recipes", recipeRoutes);

// catch all other routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`Server is Running on Port:${port}....`);
});

export { connection };
