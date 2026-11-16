import { z } from "zod";

export const formSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Indica o nome do curso.")
    .max(40, "Máximo de 40 caracteres."),
});

export type FormSchema = typeof formSchema;
