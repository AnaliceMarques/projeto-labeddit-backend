export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface UserDB {
  id: string;
  username: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
  updated_at: string;
}

export interface UserModel {
  id: string;
  username: string;
  email: string;
  role: USER_ROLES;
  createdAt: string;
  updatedAt: string;
}

export interface TokenPayload {
  id: string;
  username: string;
  role: USER_ROLES;
}

export class User {
  constructor(
    private id: string,
    private username: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,
    private createdAt: string,
    private updatedAt: string
  ) {}

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(value: string): void {
    this.username = value;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(value: string): void {
    this.email = value;
  }

  getPassword(): string {
    return this.password;
  }

  setPassword(value: string): void {
    this.password = value;
  }

  getRole(): USER_ROLES {
    return this.role;
  }

  setRole(value: USER_ROLES): void {
    this.role = value;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  setCreatedAt(value: string): void {
    this.createdAt = value;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  setUpdatedAt(value: string): void {
    this.updatedAt = value;
  }

  toDBModel(): UserDB {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  toBusinessModel(): UserModel {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toPayloadModel(): TokenPayload {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
    };
  }
}
