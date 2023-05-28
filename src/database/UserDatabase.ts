import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  //Insert User
  insertUser = async (userDB: UserDB): Promise<void> => {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(userDB);
  };

  //Find Users
  findUsers = async (q: string | undefined): Promise<UserDB[]> => {
    let usersDB;

    if (q) {
      const result: UserDB[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      )
        .where("username", "LIKE", `%${q}%`)
        .orWhere("email", "LIKE", `%${q}%`);

      usersDB = result;
    } else {
      const result: UserDB[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      );

      usersDB = result;
    }

    return usersDB;
  };

  //Find User By Id
  findUserById = async (id: string): Promise<UserDB | undefined> => {
    const [userDB]: UserDB[] | undefined = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ id });

    return userDB;
  };

  //Update User
  updateUser = async (userDB: UserDB): Promise<void> => {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS)
      .update(userDB)
      .where({ id: userDB.id });
  };

  //Delete User
  deleteUser = async (id: string): Promise<void> => {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS)
      .delete()
      .where({ id });
  };
}
