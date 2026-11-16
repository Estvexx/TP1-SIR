const url = `${API_BASE_URL}/cursos`;

const qntCursos = document.querySelector("#total-cursos");
const qntAlunosInscritos = document.querySelector("#total-alunos");
const mediaAlunos = document.querySelector("#media-alunos");

async function cursoSummary() {
  try {
    const response = await fetch(`${url}/summary`);
    if (!response.ok)
      throw new Error(
        await mensagemErroBackend(response, "Erro ao carregar resumo."),
      );

    const resumo = await response.json();
    qntCursos.textContent = resumo.cursosDisponiveis;
    qntAlunosInscritos.textContent = resumo.alunosInscritos;
    mediaAlunos.textContent = resumo.mediaPorCurso
      ? resumo.mediaPorCurso.toFixed(1)
      : "--";
  } catch (erro) {
    qntCursos.textContent = "--";
    qntAlunosInscritos.textContent = "--";
    mediaAlunos.textContent = "--";
    console.error(erro);
  }
}

cursoSummary();
