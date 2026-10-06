const api_url = "http://localhost:3000/alunos";
const table = document.querySelector("#table");
const message = document.querySelector("#message");
const modal = document.querySelector("#modal");
const form = document.querySelector("#form");
const loader = document.querySelector("#loader");
let alunoId = null;
let pendingLoads = 0;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  guardarAluno();
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

async function getAlunos() {
  showLoading();
  try {
    const response = await fetch(api_url);
    console.log(response);
    if (!response.ok) throw new Error("Erro ao carregar alunos");
    return await response.json();
  } catch (erro) {
    showToast(
      "Não foi possível carregar a lista de alunos. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function getAluno(id) {
  showLoading();
  try {
    if (!id) throw new Error("ID do aluno inválido");
    const response = await fetch(`${api_url}/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar alunos");
    return await response.json();
  } catch (erro) {
    showToast(
      "Não foi possível carregar os dados do aluno. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
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
    cursoId: Number(form.elements.cursoId.value),
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

    if (!response.ok) throw new Error("Erro ao guardar aluno");

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
    showToast(
      "Não foi possível guardar o aluno. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}

async function apagarAluno(id) {
  showLoading();
  try {
    const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao eliminar aluno");
    if (await listAlunos()) {
      showToast("Aluno eliminado com sucesso.", "success", 5000);
    }
  } catch (erro) {
    showToast(
      "Não foi possível eliminar o aluno. Tenta novamente.",
      "danger",
      5000,
    );
    console.error(erro);
  } finally {
    hideLoading();
  }
}
async function editar(id) {
  const aluno = await getAluno(id);
  if (!aluno) return;
  alunoId = aluno.id;
  form.elements.nome.value = aluno.nome;
  form.elements.apelido.value = aluno.apelido;
  form.elements.idade.value = aluno.idade;
  form.elements.cursoId.value = aluno.cursoId;
  form.elements.ano.value = aluno.ano;

  form.querySelector("h2").textContent = "Editar aluno";
  modal.showModal();
}

async function listAlunos() {
  const alunos = await getAlunos();

  if (!alunos) return false;

  message.textContent = "";
  table.innerHTML = "";

  for (const aluno of alunos) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${aluno.id}</td>
      <td>${aluno.nome} ${aluno.apelido}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.cursoId}</td>
      <td>${aluno.ano}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Apagar</button>
      </td>
    `;

    tr.querySelector(".btn-edit").onclick = () => editar(aluno.id);
    tr.querySelector(".btn-delete").onclick = () => apagarAluno(aluno.id);

    table.appendChild(tr);
  }
  return true;
}

listAlunos();

function showLoading() {
  if (pendingLoads === 0) loader.showModal();
  pendingLoads += 1;
}

function hideLoading() {
  pendingLoads = Math.max(0, pendingLoads - 1);
  if (pendingLoads === 0) loader.close();
}
