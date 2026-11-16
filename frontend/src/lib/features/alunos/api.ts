import { API_URL, apiError } from "#lib/api.js";
import type { z } from "zod";
import type { formSchema } from "./schema.js";
import type { Aluno } from "./types.js";

export async function listAlunos(): Promise<Aluno[]> {
  const response = await fetch(`${API_URL}/alunos`);
  if (!response.ok) throw new Error(await apiError(response));
  return response.json();
}

export async function createAluno(
  aluno: z.output<typeof formSchema>,
): Promise<void> {
  const response = await fetch(`${API_URL}/alunos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
  if (!response.ok) throw new Error(await apiError(response));
}

export async function updateAluno(
  id: string,
  aluno: z.output<typeof formSchema>,
): Promise<void> {
  const response = await fetch(`${API_URL}/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });
  if (!response.ok) throw new Error(await apiError(response));
}

export async function deleteAluno(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/alunos/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(await apiError(response));
}
