import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const alunoSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: randomUUID,
    },
    nome: {
      type: String,
      required: [true, "Campo nome é obrigatório"],
      trim: true,
    },
    apelido: {
      type: String,
      required: [true, "Campo apelido é obrigatório"],
      trim: true,
    },
    idade: {
      type: Number,
      required: [true, "Campo idade é obrigatório"],
      min: [1, "A idade mínima não pode ser inferior a 1"],
      max: [130, "A idade mínima não pode ser superior a 130"],
    },
    curso: {
      type: mongoose.Schema.Types.UUID,
      ref: "Course",
      required: [true, "Campo curso é obrigatório"],
    },

    ano: { type: Number, required: [true, "Campo ano é obrigatório"] },
  },
  { timestamps: true },
);

export const Aluno = mongoose.model("Aluno", alunoSchema);
