import z from "zod";

export interface CreateCommentInputDTO {
  content: string;
  token: string;
  postId: string;
}

export type CreateCommentOutputDTO = {
  message: "Comentário publicado com sucesso";
};

export const CreateCommentSchema = z
  .object({
    content: z.string().min(1),
    token: z.string().min(1),
    postId: z.string().min(1),
  })
  .transform((data) => data as CreateCommentInputDTO);
