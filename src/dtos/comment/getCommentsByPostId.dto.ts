import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentsByPostIdInputDTO {
  token: string;
  postId: string;
}

export type GetCommentsByPostIdOutputDTO = { result: CommentModel[] };

export const GetCommentsByPostIdSchema = z
  .object({
    token: z.string().min(1),
    postId: z.string().min(1),
  })
  .transform((data) => data as GetCommentsByPostIdInputDTO);
