import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { UserBusiness } from "../business/UserBusiness";
import { SignupSchema } from "../dtos/user/signup.dto";
import { LoginSchema } from "../dtos/user/login.dto";
import { GetUsersSchema } from "../dtos/user/getUsers.dto";
import { EditUserSchema } from "../dtos/user/editUser.dto";
import { DeleteUserSchema } from "../dtos/user/deleteUser.dto";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  //signup
  signup = async (req: Request, res: Response) => {
    try {
      const input = SignupSchema.parse({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.signup(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //login
  login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.login(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //getUsers (apenas para ADMIN)
  getUsers = async (req: Request, res: Response) => {
    try {
      const input = GetUsersSchema.parse({
        token: req.headers.authorization,
        q: req.query.q,
      });

      const output = await this.userBusiness.getUsers(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //editUser
  editUser = async (req: Request, res: Response) => {
    try {
      const input = EditUserSchema.parse({
        token: req.headers.authorization,
        idToEdit: req.params.id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.editUser(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  //deleteUser
  deleteUser = async (req: Request, res: Response) => {
    try {
      const input = DeleteUserSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      const output = await this.userBusiness.deleteUser(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
