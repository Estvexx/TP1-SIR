import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getSummary,
  updateCourse,
} from "../controllers/courseController.js";
import { validateUUID, validateCurso } from "../middlewares/middleware.js";

const courseRouter = Router();

courseRouter.post("/", validateCurso, createCourse);
courseRouter.get("/", getAllCourses);
courseRouter.get("/summary", getSummary);
courseRouter.get("/:id", validateUUID, getCourseById);
courseRouter.put("/:id", validateUUID, validateCurso, updateCourse);
courseRouter.delete("/:id", validateUUID, deleteCourse);

export default courseRouter;
