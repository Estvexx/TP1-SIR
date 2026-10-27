const url = `${API_BASE_URL}/alunos`;

const totalAlunos = document.querySelector("#total-alunos");
const cursosAtivos = document.querySelector("#total-cursos");
const mediaIdades = document.querySelector("#idade-media");

async function alunosSummary() {
  try {
    const response = await fetch(`${url}/summary`);
    if (!response.ok) throw new Error("Erro ao carregar o resumo dos alunos.");

    const dados = await response.json();
    totalAlunos.textContent = dados.qntAlunos;
    cursosAtivos.textContent = dados.cursosAtivos;
    mediaIdades.textContent =
      dados.idadeMedia === null ? "--" : `${dados.idadeMedia.toFixed(1)} anos`;
  } catch (erro) {
    totalAlunos.textContent = "--";
    cursosAtivos.textContent = "--";
    mediaIdades.textContent = "--";
    console.error(erro);
  }
}

alunosSummary();
