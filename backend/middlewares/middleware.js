import mongoose from "mongoose";

export function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const mensagens = Object.values(err.errors).map((erro) => erro.message);

    return res.status(400).json({
      mensagem: mensagens.join(" "),
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      mensagem: "O JSON enviado é inválido.",
    });
  }

  console.error(err);

  return res.status(500).json({
    mensagem: "Erro interno do servidor.",
  });
}

export function validateUUID(req, res, next) {
  if (!mongoose.mongo.BSON.UUID.isValid(req.params.id)) {
    return res.status(400).json({
      mensagem: "UUID inválido.",
    });
  }

  next();
}

export function validateAluno(req, res, next) {
  const { nome, apelido, idade, curso, ano } = req.body ?? {};

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof apelido !== "string" ||
    apelido.trim() === "" ||
    !Number.isInteger(idade) ||
    curso == "" ||
    !Number.isInteger(ano)
  ) {
    return res.status(400).json({
      mensagem: "Preenche corretamente os campos.",
    });
  }

  next();
}

export function validateCurso(req, res, next) {
  const { nome } = req.body;
  const nomeCurso = typeof nome === "string" ? nome.trim() : "";

  if (!nomeCurso || nomeCurso.length > 23) {
    return res.status(400).json({
      mensagem: !nomeCurso
        ? "Preenche corretamente o campo nome"
        : "O nome do curso não pode ser superior a 23 caracteres",
    });
  }
  next();
}
