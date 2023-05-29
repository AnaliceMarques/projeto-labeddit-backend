import z from "zod";
import { PostModel } from "../../models/Post";

export interface GetAllPostsInputDTO {
  token: string;
}

export type GetAllPostsOutputDTO = { result: PostModel[] };

export const GetAllPostsSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetAllPostsInputDTO);
