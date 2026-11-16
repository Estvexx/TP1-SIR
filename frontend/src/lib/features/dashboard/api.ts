import { API_URL, apiError } from "#lib/api.js";
import { listAlunos } from "../alunos/api.js";
import { listCursos } from "../cursos/api.js";
import type { Aluno } from "../alunos/types.js";
import type { Curso } from "../cursos/types.js";

type AlunoSummary = {
	qntAlunos: number;
	cursosAtivos: number;
	idadeMedia: number | null;
};

type CursoSummary = {
	cursosDisponiveis: number;
	alunosInscritos: number;
	mediaPorCurso: number;
};

export type DashboardData = {
	alunoSummary: AlunoSummary;
	cursoSummary: CursoSummary;
	alunos: Aluno[];
	cursos: Curso[];
};

async function getSummary<T>(path: string): Promise<T> {
	const response = await fetch(`${API_URL}${path}`);
	if (!response.ok) throw new Error(await apiError(response));
	return response.json();
}

export async function getDashboardData(): Promise<DashboardData> {
	const [alunoSummary, cursoSummary, alunos, cursos] = await Promise.all([
		getSummary<AlunoSummary>("/alunos/summary"),
		getSummary<CursoSummary>("/cursos/summary"),
		listAlunos(),
		listCursos()
	]);

	return { alunoSummary, cursoSummary, alunos, cursos };
}
