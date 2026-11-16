export const API_URL = import.meta.env.DEV
	? "http://localhost:3000"
	: (import.meta.env.VITE_API_URL ?? "https://tp1-sir-klbw.onrender.com");

export async function apiError(response: Response) {
	const body = await response.json().catch(() => ({}));
	return body.mensagem || body.message || "Não foi possível concluir a operação.";
}
