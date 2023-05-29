import z from "zod";

export interface LikeOrDislikeCommentInputDTO {
  commentId: string;
  token: string;
  like: boolean;
}

export type LikeOrDislikeCommentOutputDTO = { message: "Reação enviada" };

export const LikeOrDislikeCommentSchema = z
  .object({
    commentId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
  })
  .transform((data) => data as LikeOrDislikeCommentInputDTO);
