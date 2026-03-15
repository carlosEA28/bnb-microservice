import { randomUUID } from "crypto";
import { CreateUserDto } from "../../dtos/createUserDTO";
import { User, Role } from "../../generated/prisma/client";
import { UserRepository } from "../user-repository";

export class InMemoryAuthRepository implements UserRepository {
  public items: User[] = [];

  async registerUser(params: CreateUserDto): Promise<User> {
    const user = {
      id: randomUUID(),
      cognitoId: randomUUID(),
      name: params.name,
      email: params.email,
      password: params.password,
      imageUrl: params.imageUrl ?? null,
      role: Role.GUEST,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }
  async deleteUser(id: string): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      return;
    }

    this.items.splice(userIndex, 1);
  }
  async updateUserImage(id: string, imageUrl: string): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new Error("User not found.");
    }

    const user = this.items[userIndex];
    const updatedUser = {
      ...user,
      imageUrl,
      updatedAt: new Date(),
    };

    this.items[userIndex] = updatedUser;

    return updatedUser;
  }
}
