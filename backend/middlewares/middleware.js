import mongoose from "mongoose";

export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(409).json({
      mensagem: req.baseUrl === "/cursos"
        ? "Já existe um curso com esse nome."
        : "Já existe um registo com esse valor.",
    });
  }
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
  for (const campo of ["nome", "apelido", "curso"]) {
    if (typeof req.body?.[campo] === "string") {
      req.body[campo] = req.body[campo].trim();
    }
  }

  const { nome, apelido, idade, curso, ano } = req.body ?? {};

  if ([nome, apelido].some((valor) => typeof valor === "string" && /[<>]|style\s*=/i.test(valor))) {
    return res.status(400).json({ mensagem: "Taste a esticar" });
  }

  if (typeof nome !== "string" || nome.length < 1 || nome.length > 23) {
    return res.status(400).json({
      mensagem: "O nome deve ter entre 1 e 23 caracteres.",
    });
  }

  if (
    typeof apelido !== "string" ||
    apelido.length < 1 ||
    apelido.length > 23
  ) {
    return res.status(400).json({
      mensagem: "O apelido deve ter entre 1 e 23 caracteres.",
    });
  }

  if (!Number.isSafeInteger(idade) || idade < 1 || idade > 130) {
    return res.status(400).json({
      mensagem: "A idade deve ser um número inteiro entre 1 e 130.",
    });
  }

  if (typeof curso !== "string" || !mongoose.mongo.BSON.UUID.isValid(curso)) {
    return res.status(400).json({
      mensagem: "O curso deve ter um UUID válido.",
    });
  }

  if (!Number.isSafeInteger(ano) || ano < 1) {
    return res.status(400).json({
      mensagem: "O ano deve ser um número inteiro igual ou superior a 1.",
    });
  }

  return next();
}

export function validateCurso(req, res, next) {
  if (typeof req.body?.nome === "string") {
    req.body.nome = req.body.nome.trim();
  }

  const { nome } = req.body ?? {};

  if (typeof nome === "string" && /[<>]|style\s*=/i.test(nome)) {
    return res.status(400).json({ mensagem: "Taste a esticar" });
  }

  if (typeof nome !== "string" || nome.length < 1 || nome.length > 150) {
    return res.status(400).json({
      mensagem: "O nome do curso deve ter entre 1 e 150 caracteres.",
    });
  }

  return next();
}
