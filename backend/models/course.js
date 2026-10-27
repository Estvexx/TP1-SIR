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
      minlength: [1, "O nome do curso não pode ser inferior a 1 caractere"],
      maxlength: [150, "O nome do curso não pode ser superior a 150 caracteres"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export const Course = mongoose.model("Course", courseSchema);
