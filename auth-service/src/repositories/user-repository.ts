import { User } from "../generated/prisma/client";
import { CreateUserDto } from "../dtos/createUserDTO";

export interface UserRepository {
  registerUser(params: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
  updateUserImage(id: string, imageUrl: string): Promise<User>;
}
