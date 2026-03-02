import { CreateUserDto } from "../../dtos/createUserDTO";
import { User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../user-repository";

export class PrismaUserRepository implements UserRepository {
  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  async registerUser(params: CreateUserDto): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        imageUrl: params.imageUrl,
        cognitoId: params.cognitoId!,
      },
    });
    return user;
  }

  async updateUserImage(id: string, imageUrl: string): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: { imageUrl },
    });

    return user;
  }
}
