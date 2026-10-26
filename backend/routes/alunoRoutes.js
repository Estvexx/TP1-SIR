import { Router } from "express";
import {
  createAluno,
  getAllUsers,
  countUsers,
  getSummary,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/alunoController.js";
import { validateUUID, validateAluno } from "../middlewares/middleware.js";

const alunoRouter = Router();

alunoRouter.post("/", validateAluno, createAluno);
alunoRouter.get("/", getAllUsers);
alunoRouter.get("/count", countUsers);
alunoRouter.get("/summary", getSummary);
alunoRouter.get("/:id", validateUUID, getUserById);
alunoRouter.put("/:id", validateUUID, validateAluno, updateUser);
alunoRouter.delete("/:id", validateUUID, deleteUser);

export default alunoRouter;
