import { Aluno } from "../models/aluno.js";
import mongoose from "mongoose";
import { getCourseById } from "./courseController.js";

export async function createAluno(req, res) {
  const { nome, apelido, idade, curso, ano } = req.body;
  //getCourseById(curso);
  const aluno = await Aluno.create({ nome, apelido, idade, curso, ano });
  await aluno.populate("curso");

  return res.status(201).json(aluno);
}

export async function getAllUsers(req, res) {
  const alunos = await Aluno.find().populate("curso");

  return res.status(200).json(alunos);
}

export async function getUserById(req, res) {
  const { id } = req.params;

  const aluno = await Aluno.findById(id).populate("curso");

  if (!aluno) {
    return res.status(404).json({
      mensagem: "Aluno não encontrado.",
    });
  }

  return res.status(200).json(aluno);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  const { nome, apelido, idade, curso, ano } = req.body;

  const aluno = await Aluno.findByIdAndUpdate(id, {
    nome,
    apelido,
    idade,
    curso,
    ano,
  });

  if (!aluno) {
    res.status(404).json({
      mensagem: "Aluno não encontrado",
    });
  }

  res.status(200).json({
    mensagem: "Aluno atualizado com sucesso",
  });
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  const aluno = await Aluno.findByIdAndDelete(id);

  if (!aluno) {
    res.status(404).json({
      mensagem: "Erro ao eliminar aluno",
    });
  }

  res.status(200).json({
    mensagem: "Aluno eliminado com sucesso",
  });
}

export async function countUsers(req, res) {
  const countUsers = await Aluno.countDocuments();

  return res.status(200).json({ count: countUsers });
}

export async function getSummary(req, res) {
  const [totalAlunos, cursosAtivos, idadeMedia] = await Promise.all([
    Aluno.countDocuments(),
    Aluno.distinct("curso").then((cursos) => cursos.length),
    Aluno.aggregate([
      {
        $group: {
          _id: null,
          media: { $avg: "$idade" },
        },
      },
    ]),
  ]);

  return res.status(200).json({
    totalAlunos,
    cursosAtivos,
    idadeMedia: idadeMedia[0]?.media ?? null,
  });
}
