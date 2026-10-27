import { Course } from "../models/course.js";
import { Aluno } from "../models/aluno.js";

export async function createCourse(req, res) {
  const { nome } = req.body;

  const course = await Course.create({ nome });

  return res.status(201).json({ message: "Curso criado com sucesso" }, course);
}

export async function getAllCourses(req, res) {
  const courses = await Course.find();

  return res.status(201).json(courses);
}

export async function getSummary(req, res) {
  const [cursosDisponiveis, alunosInscritos] = await Promise.all([
    Course.countDocuments(),
    Aluno.countDocuments(),
  ]);

  return res.status(200).json({
    cursosDisponiveis,
    alunosInscritos,
    mediaPorCurso: cursosDisponiveis ? alunosInscritos / cursosDisponiveis : 0,
  });
}

export async function getCourseById(req, res) {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return res.status(404).json({
      mensagem: "Curso não encontrado.",
    });
  }

  return res.status(200).json(course);
}

export async function updateCourse(req, res) {
  const { id } = req.params;
  const { nome } = req.body;

  const course = await Course.findByIdAndUpdate(id, {
    nome,
  });

  if (!course) {
    res.status(400).json({
      mensagem: "Curso não encontrado",
    });
  }

  res.status(201).json({
    mensagem: "Curso atualizado com sucesso",
  });
}

export async function deleteCourse(req, res) {
  const { id } = req.params;
  const aluno = await Aluno.exists({ curso: id });

  if (aluno) {
    return res.status(409).json({
      mensagem: "Existe um aluno associado a este curso",
    });
  }

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    return res.status(404).json({
      mensagem: "Erro ao eliminar curso",
    });
  }

  res.status(201).json({
    mensagem: "Curso eliminado com sucesso",
  });
}
