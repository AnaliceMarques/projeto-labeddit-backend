import z from "zod";
import { UserModel } from "../../models/User";

export interface GetUsersInputDTO {
  token: string;
  q: string | undefined;
}

export type GetUsersOutputDTO = {
  result: UserModel[];
};

export const GetUsersSchema = z
  .object({
    token: z.string().min(1),
    q: z.string().optional(),
  })
  .transform((data) => data as GetUsersInputDTO);
