import { Router } from "express";
import {
  createAluno,
  getAllUsers,
  getSummary,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/alunoController.js";
import { validateUUID, validateAluno } from "../middlewares/middleware.js";

const alunoRouter = Router();

alunoRouter.post("/", validateAluno, createAluno).get("/", getAllUsers);
alunoRouter.get("/summary", getSummary);
alunoRouter
  .get("/:id", validateUUID, getUserById)
  .put("/:id", validateUUID, validateAluno, updateUser)
  .delete("/:id", validateUUID, deleteUser);

export default alunoRouter;
