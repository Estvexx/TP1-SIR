import { z } from "zod";

export const formSchema = z.object({
	nome: z.string().trim().min(1, "Indica o nome.").max(23, "Máximo de 23 caracteres."),
	apelido: z.string().trim().min(1, "Indica o apelido.").max(23, "Máximo de 23 caracteres."),
	idade: z.coerce.number<number>().int("Indica uma idade inteira.").min(1, "Idade mínima: 1.").max(130, "Idade máxima: 130."),
	curso: z.string().min(1, "Seleciona um curso."),
	ano: z.coerce.number<number>().int("Indica um ano inteiro.").min(1, "Ano mínimo: 1.")
});

export type FormSchema = typeof formSchema;
