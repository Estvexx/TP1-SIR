import express from "express";
import alunoRouter from "../routes/alunoRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import { errorHandler } from "../middlewares/middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" with { type: "json" };

const app = express();

app.use(express.json());
app.use(express.static("../frontend"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/alunos", alunoRouter);
app.use("/cursos", courseRouter);

app.use(errorHandler);

export default app;
