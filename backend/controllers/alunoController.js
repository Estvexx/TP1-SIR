import { Aluno } from "../models/aluno.js";

export async function createAluno(req, res) {
  const { nome, apelido, idade, curso, ano } = req.body;
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

// countDocuments retorna quantidade
// Distinct retorna-me um array de um atributo e remove dups
// Proprieda group retorna um array
export async function getSummary(req, res) {
  const [qntAlunos, cursosAtivos, idadeMediaResultado] = await Promise.all([
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

  const idadeMedia =
    (idadeMediaResultado[0] && idadeMediaResultado[0].media) || null;

  return res.status(200).json({
    qntAlunos,
    cursosAtivos,
    idadeMedia,
  });
}
