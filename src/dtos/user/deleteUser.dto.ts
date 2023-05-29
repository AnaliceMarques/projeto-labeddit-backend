import z from "zod";

export interface DeleteUserInputDTO {
  token: string;
  idToDelete: string;
}

export interface DeleteUserOutputDTO {
  message: "Usuário excluído com sucesso";
}

export const DeleteUserSchema = z
  .object({
    token: z.string().min(1),
    idToDelete: z.string().min(1),
  })
  .transform((data) => data as DeleteUserInputDTO);
