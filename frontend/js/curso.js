const api_url = "http://localhost:3000/cursos";
const table = document.querySelector("#table");
const message = document.querySelector("#message");
const modal = document.querySelector("#modal");
const form = document.querySelector("#form");
const loader = document.querySelector("#loader");

let cursoId = null;
let pendingLoads = 0;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  guardarCurso();
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
  const curso = {
    curso: form.elements.curso.value,
  };

  const url = cursoId ? `${api_url}/${cursoId}` : api_url;
  const method = cursoId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(curso),
    });

    if (!response.ok) throw new Error("Erro ao guardar curso");

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
    showToast(
      "Não foi possível guardar o curso. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function getCursos() {
  showLoading();
  try {
    const response = await fetch(api_url);
    if (!response.ok) throw new Error("Erro ao carregar cursos");
    return await response.json();
  } catch (erro) {
    showToast(
      "Não foi possível carregar a lista de cursos. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function getCurso(id) {
  showLoading();
  try {
    if (!id) throw new Error("ID do curso inválido");
    const response = await fetch(`${api_url}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar cursos");
    return await response.json();
  } catch (erro) {
    showToast(
      "Não foi possível carregar os dados do curso. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function apagarCurso(id) {
  showLoading();
  try {
    const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao eliminar curso");
    if (await listCursos()) {
      showToast("Curso eliminado com sucesso.", "success", 5000);
    }
  } catch (erro) {
    showToast(
      "Não foi possível eliminar o curso. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function editar(id) {
  const curso = await getCurso(id);
  if (!curso) return;
  cursoId = curso.id;
  form.elements.curso.value = curso.curso;

  form.querySelector("h2").textContent = "Editar curso";
  modal.showModal();
}

async function listCursos() {
  const cursos = await getCursos();

  if (!cursos) return false;

  message.textContent = "";
  table.innerHTML = "";

  for (const curso of cursos) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${curso.id}</td>
      <td>${curso.curso}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Apagar</button>
      </td>
    `;

    tr.querySelector(".btn-edit").onclick = () => editar(curso.id);
    tr.querySelector(".btn-delete").onclick = () => apagarCurso(curso.id);

    table.appendChild(tr);
  }
  return true;
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
