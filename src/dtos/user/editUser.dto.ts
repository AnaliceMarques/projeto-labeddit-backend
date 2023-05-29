import z from "zod";

export interface EditUserInputDTO {
  token: string;
  idToEdit: string;
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

export interface EditUserOutputDTO {
  message: "Usuário atualizado com sucesso";
}

export const EditUserSchema = z
  .object({
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    username: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(4).optional(),
  })
  .transform((data) => data as EditUserInputDTO);
