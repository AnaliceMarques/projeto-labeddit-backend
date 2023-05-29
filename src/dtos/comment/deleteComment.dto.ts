import z from "zod";

export interface DeleteCommentInputDTO {
  token: string;
  idToDelete: string;
}

export type DeleteCommentOutputDTO = {
  message: "Comentário excluído com sucesso";
};

export const DeleteCommentSchema = z
  .object({
    token: z.string().min(1),
    idToDelete: z.string().min(1),
  })
  .transform((data) => data as DeleteCommentInputDTO);
