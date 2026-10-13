import app from "./app.js";
import { connectDB } from "../config/db.js";

const port = process.env.PORT || 3000;

try {
  await connectDB();

  app.listen(port, () => {
    console.log(`Servidor em http://localhost:${port}`);
  });
} catch (error) {
  console.error("Erro ao arrancar:", error.message);
  process.exitCode = 1;
}
