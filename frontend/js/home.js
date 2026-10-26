const totalAlunos = document.querySelector("#total-alunos");

async function carregarTotalAlunos() {
  try {
    const response = await fetch("http://localhost:3000/alunos/count");

    if (!response.ok) {
      throw new Error("Não foi possível carregar o total de alunos.");
    }

    const { count } = await response.json();
    totalAlunos.textContent = count;
  } catch (erro) {
    totalAlunos.textContent = "--";
    console.error(erro);
  }
}

carregarTotalAlunos();
