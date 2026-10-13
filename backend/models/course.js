import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const courseSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
    },
    nome: {
      type: String,
      required: [true, "Campo nome do curso é obrigatório"],
      trim: true,
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
