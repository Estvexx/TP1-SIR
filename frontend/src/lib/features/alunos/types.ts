import type { Curso } from "../cursos/types.js";

export type Aluno = {
	_id: string;
	nome: string;
	apelido: string;
	idade: number;
	ano: number;
	curso: Curso | null;
};
