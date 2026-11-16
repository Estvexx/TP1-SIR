import { API_URL, apiError } from "#lib/api.js";
import type { z } from "zod";
import type { formSchema } from "./schema.js";
import type { Curso } from "./types.js";

export async function listCursos(): Promise<Curso[]> {
	const response = await fetch(`${API_URL}/cursos`);
	if (!response.ok) throw new Error(await apiError(response));
	return response.json();
}

export async function createCurso(curso: z.output<typeof formSchema>): Promise<void> {
	const response = await fetch(`${API_URL}/cursos`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(curso)
	});
	if (!response.ok) throw new Error(await apiError(response));
}

export async function updateCurso(id: string, curso: z.output<typeof formSchema>): Promise<void> {
	const response = await fetch(`${API_URL}/cursos/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(curso)
	});
	if (!response.ok) throw new Error(await apiError(response));
}

export async function deleteCurso(id: string): Promise<void> {
	const response = await fetch(`${API_URL}/cursos/${id}`, { method: "DELETE" });
	if (!response.ok) throw new Error(await apiError(response));
}
