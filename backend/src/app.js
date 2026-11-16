import express from "express";
import cors from "cors";
import alunoRouter from "../routes/alunoRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import { errorHandler } from "../middlewares/middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" with { type: "json" };

const app = express();

app.use(cors({
  origin: [
    /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/,
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/$/, "")] : []),
  ],
}));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/alunos", alunoRouter);
app.use("/cursos", courseRouter);

if (process.env.FRONTEND_URL) {
  const frontend = process.env.FRONTEND_URL.replace(/\/$/, "");
  app.get("/", (_req, res) => res.redirect(302, frontend));
  app.get("/index.html", (_req, res) => res.redirect(302, frontend));
  app.get("/aluno_overview.html", (_req, res) => res.redirect(302, `${frontend}/alunos`));
  app.get("/curso_overview.html", (_req, res) => res.redirect(302, `${frontend}/cursos`));
}

app.use(errorHandler);

export default app;
