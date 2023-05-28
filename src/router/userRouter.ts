import express from "express";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";
import { UserDatabase } from "../database/UserDatabase";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);

//   userRouter.post("/signup", userController.signup);
//   userRouter.post("/login", userController.login);
//   userRouter.get("/", userController.getUsers);
//   userRouter.put("/", userController.editUser);
//   userRouter.delete("/", userController.deleteUser);
