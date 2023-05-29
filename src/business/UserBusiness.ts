import { UserDatabase } from "../database/UserDatabase";
import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
} from "../dtos/user/deleteUser.dto";
import { EditUserInputDTO, EditUserOutputDTO } from "../dtos/user/editUser.dto";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/user/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/Unauthorizederror";
import { USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  //signup
  signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { username, email, password } = input;

    const id = this.idGenerator.generate();

    const idExist = await this.userDatabase.findUserById(id);

    if (idExist) {
      throw new ConflictError();
    }

    const emailExist = await this.userDatabase.findUserByEmail(email);

    if (emailExist) {
      throw new ConflictError("e-mail já cadastrado");
    }

    const hashedPassword = await this.hashManager.hash(password);

    const user = new User(
      id,
      username,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString(),
      new Date().toISOString()
    );

    const userDB = user.toDBModel();
    await this.userDatabase.insertUser(userDB);

    const tokenPayload = user.toPayloadModel();
    const token = this.tokenManager.createToken(tokenPayload);

    const output: SignupOutputDTO = {
      token,
    };

    return output;
  };

  //login
  login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userDB = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new BadRequestError("e-mail e/ou senha inválido");
    }

    const user = new User(
      userDB.id,
      userDB.username,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at,
      userDB.updated_at
    );

    const hashedPassword = user.getPassword();

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("e-mail e/ou senha inválido");
    }

    const tokenPayload = user.toPayloadModel();
    const token = this.tokenManager.createToken(tokenPayload);

    const output: LoginOutputDTO = {
      token,
    };

    return output;
  };

  //getUsers (apenas ADMIN)
  getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { token, q } = input;

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("somente admins podem acessar o getUsers");
    }

    const usersDB = await this.userDatabase.findUsers(q);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.username,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at,
        userDB.updated_at
      );

      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = { result: users };

    return output;
  };

  //editUser
  editUser = async (input: EditUserInputDTO): Promise<EditUserOutputDTO> => {
    const { token, idToEdit, username, email, password } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const userDB = await this.userDatabase.findUserById(idToEdit);

    if (!userDB) {
      throw new NotFoundError();
    }

    const user = new User(
      userDB.id,
      userDB.username,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at,
      userDB.updated_at
    );

    if (email !== undefined) {
      const emailExist = await this.userDatabase.findUserByEmail(email);

      if (emailExist) {
        throw new ConflictError("e-mail já cadastrado");
      } else {
        user.setEmail(email);
      }
    }

    if (password !== undefined) {
      const hashedPassword = await this.hashManager.hash(password);
      user.setPassword(hashedPassword);
    }

    if (username !== undefined) {
      user.setUsername(username);
    }

    user.setUpdatedAt(new Date().toISOString());

    const updateUserDB = user.toDBModel();
    await this.userDatabase.updateUser(updateUserDB);

    const output: EditUserOutputDTO = {
      message: "Usuário atualizado com sucesso",
    };

    return output;
  };

  //deleteUser
  deleteUser = async (
    input: DeleteUserInputDTO
  ): Promise<DeleteUserOutputDTO> => {
    const { token, idToDelete } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const userDB = await this.userDatabase.findUserById(idToDelete);

    if (!userDB) {
      throw new NotFoundError();
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== idToDelete) {
        throw new ForbiddenError("somente o dono da conta pode excluí-la");
      }
    }

    await this.userDatabase.deleteUser(payload.id);

    const output: DeleteUserOutputDTO = {
      message: "Usuário excluído com sucesso",
    };

    return output;
  };
}
