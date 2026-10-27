const api_url = `${API_BASE_URL}/cursos`;
const table = document.querySelector("#table");
const message = document.querySelector("#message");
const modal = document.querySelector("#modal");
const form = document.querySelector("#form");
const loader = document.querySelector("#loader");
const searchInput = document.querySelector("#pesquisa-cursos");
const clearSearch = document.querySelector("#limpar-pesquisa");
const resultCount = document.querySelector("#resultado-pesquisa");

let cursoId = null;
let pendingLoads = 0;
let cursosAtuais = [];

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
  guardarCurso();
});
searchInput.addEventListener("input", () => renderCursos(searchInput.value));
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  renderCursos();
  searchInput.focus();
});

document.querySelector("#abrir-form").onclick = function () {
  cursoId = null;
  form.reset();
  modal.showModal();
};

document.querySelector("#fechar-form").onclick = function () {
  cursoId = null;
  form.reset();
  modal.close();
};

async function guardarCurso() {
  showLoading();
  const nome = { nome: form.elements.curso.value };

  const url = cursoId ? `${api_url}/${cursoId}` : api_url;
  const method = cursoId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nome),
    });

    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao guardar curso."),
      );

    cursoId = null;
    form.reset();
    modal.close();

    if (await listCursos()) {
      showToast(
        method === "PUT"
          ? "Curso atualizado com sucesso."
          : "Curso adicionado com sucesso.",
        "success",
        5000,
      );
    }
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function getCursos() {
  showLoading();
  try {
    const response = await fetch(api_url);
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao carregar cursos."),
      );
    return await response.json();
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function getCurso(id) {
  showLoading();
  try {
    if (!id) throw new Error("ID do curso inválido");
    const response = await fetch(`${api_url}/${id}`);
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao carregar cursos."),
      );
    return await response.json();
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function apagarCurso(id) {
  showLoading();
  try {
    const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao eliminar curso."),
      );
    if (await listCursos()) {
      showToast("Curso eliminado com sucesso.", "success", 5000);
    }
  } catch (erro) {
    showToast(erro.message || "Erro na operação.", "danger", 5000);
  } finally {
    hideLoading();
  }
}

async function editar(id) {
  const curso = await getCurso(id);
  if (!curso) return;
  cursoId = curso._id;
  form.elements.curso.value = curso.nome;

  form.querySelector("h2").textContent = "Editar curso";
  modal.showModal();
}

async function listCursos() {
  const cursos = await getCursos();

  if (!cursos) return false;

  cursosAtuais = cursos;
  renderCursos();
  return true;
}

function renderCursos(searchTerm = searchInput.value) {
  const termo = searchTerm.trim().toLocaleLowerCase();
  const cursosFiltrados = cursosAtuais.filter((curso) =>
    `${curso._id} ${curso.nome}`.toLocaleLowerCase().includes(termo),
  );

  message.textContent =
    cursosAtuais.length && !cursosFiltrados.length
      ? "Não foram encontrados cursos para esta pesquisa."
      : "";
  table.innerHTML = "";
  resultCount.textContent = `${cursosFiltrados.length} de ${cursosAtuais.length} curso(s)`;

  for (const curso of cursosFiltrados) {
    const tr = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = curso._id;

    const nameCell = document.createElement("td");
    nameCell.textContent = curso.nome;

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
    tr.append(idCell, nameCell, actionsCell);

    editButton.onclick = () => editar(curso._id);
    deleteButton.onclick = () => apagarCurso(curso._id);

    table.appendChild(tr);
  }
}

listCursos();

function showLoading() {
  if (pendingLoads === 0) loader.showModal();
  pendingLoads += 1;
}

function hideLoading() {
  pendingLoads = Math.max(0, pendingLoads - 1);
  if (pendingLoads === 0) loader.close();
}
