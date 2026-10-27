const api_url = `${API_BASE_URL}/alunos`;
const api_url_cursos = `${API_BASE_URL}/cursos`;
const table = document.querySelector("#table");
const message = document.querySelector("#message");
const modal = document.querySelector("#modal");
const form = document.querySelector("#form");
const loader = document.querySelector("#loader");
const searchInput = document.querySelector("#pesquisa-alunos");
const clearSearch = document.querySelector("#limpar-pesquisa");
const resultCount = document.querySelector("#resultado-pesquisa");
let alunoId = null;
let pendingLoads = 0;
let alunosAtuais = [];

async function mensagemErroBackend(response, fallback) {
  try {
    const dados = await response.json();
    return dados.mensagem || dados.message || fallback;
  } catch {
    return fallback;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validarAluno()) return;
  guardarAluno();
});

function validarAluno() {
  const { nome, apelido, idade, cursoId, ano } = form.elements;

  nome.value = nome.value.trim();
  apelido.value = apelido.value.trim();

  nome.setCustomValidity(
    nome.value.length < 1 || nome.value.length > 23
      ? "O nome deve ter entre 1 e 23 caracteres." : "",
  );
  apelido.setCustomValidity(
    apelido.value.length < 1 || apelido.value.length > 23
      ? "O apelido deve ter entre 1 e 23 caracteres." : "",
  );
  idade.setCustomValidity(
    !Number.isSafeInteger(idade.valueAsNumber) ||
    idade.valueAsNumber < 1 || idade.valueAsNumber > 130
      ? "A idade deve ser um inteiro entre 1 e 130." : "",
  );
  cursoId.setCustomValidity(cursoId.value === "" ? "Seleciona um curso." : "");
  ano.setCustomValidity(
    !Number.isSafeInteger(ano.valueAsNumber) || ano.valueAsNumber < 1
      ? "O ano deve ser um inteiro igual ou superior a 1." : "",
  );

  for (const campo of [nome, apelido]) {
    if (/[<>]|style\s*=/i.test(campo.value)) {
      campo.setCustomValidity("Não é permitido inserir HTML ou atributos style.");
    }
  }
  return form.reportValidity();
}

form.addEventListener("input", (event) => event.target.setCustomValidity(""));
form.addEventListener("reset", () => {
  for (const campo of form.elements) campo.setCustomValidity("");
});

searchInput.addEventListener("input", () => renderAlunos(searchInput.value));
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderAlunos();
  searchInput.focus();
});

document.querySelector("#abrir-form").onclick = function () {
  alunoId = null;
  form.reset();
  form.querySelector("h2").textContent = "Novo aluno";
  modal.showModal();
};

document.querySelector("#fechar-form").onclick = function () {
  alunoId = null;
  form.reset();
  modal.close();
};

async function getUserById(id) {
  if (!id) {
    showToast("ID do aluno inválido.", "danger", 5000);
    return;
  }
  showLoading();

  try {
    const response = await fetch(`${api_url}/${id}`);
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao carregar aluno."),
      );
    return await response.json();
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function guardarAluno() {
  showLoading();
  const aluno = {
    nome: form.elements.nome.value,
    apelido: form.elements.apelido.value,
    idade: Number(form.elements.idade.value),
    curso: form.elements.cursoId.value,
    ano: Number(form.elements.ano.value),
  };

  const url = alunoId ? `${api_url}/${alunoId}` : api_url;
  const method = alunoId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });

    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao guardar aluno."),
      );

    alunoId = null;
    form.reset();
    modal.close();
    if (await listAlunos()) {
      showToast(
        method === "PUT"
          ? "Aluno atualizado com sucesso."
          : "Aluno adicionado com sucesso.",
        "success",
        5000,
      );
    }
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function apagarAluno(id) {
  showLoading();
  try {
    const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao eliminar aluno."),
      );
    if (await listAlunos()) {
      showToast("Aluno eliminado com sucesso.", "success", 5000);
    }
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function editar(id) {
  const aluno = await getUserById(id);
  if (!aluno) return;
  alunoId = aluno._id;
  form.elements.nome.value = aluno.nome;
  form.elements.apelido.value = aluno.apelido;
  form.elements.idade.value = aluno.idade;
  form.elements.cursoId.value = aluno.curso._id;
  form.elements.ano.value = aluno.ano;

  form.querySelector("h2").textContent = "Editar aluno";
  modal.showModal();
}

async function listAlunos() {
  showLoading();
  try {
    const response = await fetch(api_url);
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao carregar alunos."),
      );

    alunosAtuais = await response.json();
    renderAlunos();
    return true;
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
    return false;
  } finally {
    hideLoading();
  }
}

listAlunos();

// Colocar os cursos no dropdown
async function carregarCursos() {
  const select = document.querySelector("#curso-aluno");
  try {
    const res = await fetch(api_url_cursos);
    if (!res.ok)
      throw new Error(
        await mensagemErroBackend(res, "Erro ao carregar cursos."),
      );
    const cursos = await res.json();

    cursos.forEach((curso) => {
      const option = document.createElement("option");
      option.value = curso._id;
      option.textContent = curso.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar cursos:", err);
  }
}

// tabela enquanto pesquiso ou nao
function renderAlunos(searchTerm = searchInput.value) {
  const termo = searchTerm.trim().toLocaleLowerCase();
  const alunosFiltrados = alunosAtuais.filter((aluno) =>
    `${aluno._id} ${aluno.nome} ${aluno.apelido} ${aluno.idade} ${aluno.curso.nome} ${aluno.ano}`
      .toLocaleLowerCase()
      .includes(termo),
  );

  message.textContent =
    alunosAtuais.length && !alunosFiltrados.length
      ? "Não foram encontrados alunos para esta pesquisa."
      : "";
  table.innerHTML = "";
  resultCount.textContent = `${alunosFiltrados.length} de ${alunosAtuais.length} aluno(s)`;

  for (const aluno of alunosFiltrados) {
    const tr = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = aluno._id;

    const nameCell = document.createElement("td");
    nameCell.textContent = `${aluno.nome} ${aluno.apelido}`;

    const ageCell = document.createElement("td");
    ageCell.textContent = aluno.idade;

    const courseCell = document.createElement("td");
    courseCell.textContent = aluno.curso.nome;

    const yearCell = document.createElement("td");
    yearCell.textContent = aluno.ano;

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "actions";

    const editButton = document.createElement("button");
    editButton.className = "btn-edit";
    editButton.textContent = "Editar";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-delete";
    deleteButton.textContent = "Apagar";

    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);
    tr.append(idCell, nameCell, ageCell, courseCell, yearCell, actionsCell);

    editButton.onclick = () => editar(aluno._id);
    deleteButton.onclick = () => apagarAluno(aluno._id);

    table.appendChild(tr);
  }
}

carregarCursos();

function showLoading() {
  if (pendingLoads === 0) loader.showModal();
  pendingLoads += 1;
}

function hideLoading() {
  pendingLoads = Math.max(0, pendingLoads - 1);
  if (pendingLoads === 0) loader.close();
}
