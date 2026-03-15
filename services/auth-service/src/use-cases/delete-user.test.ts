import { beforeEach, describe, expect, it, vi } from "vitest";
import { faker } from "@faker-js/faker";
import { InMemoryAuthRepository } from "../repositories/in-memory/in-memory-auth-repository";
import { CognitoService } from "../lib/aws/services/cognitoService";
import { S3Service } from "../lib/aws/services/s3Service";
import { DeleteUserUseCase } from "./deleteUser";
import { UserNotFoundError } from "./errors";

let userRepository: InMemoryAuthRepository;
let sut: DeleteUserUseCase;

const mockS3Service: S3Service = {
  uploadFile: vi.fn(),
  deleteFile: vi.fn().mockResolvedValue(undefined),
};

const mockCognitoService: CognitoService = {
  signUp: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  deleteUser: vi.fn().mockResolvedValue(undefined),
};

describe("Delete User Use Case", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = new InMemoryAuthRepository();
    sut = new DeleteUserUseCase(
      userRepository,
      mockCognitoService,
      mockS3Service,
    );
  });

  it("should delete an user", async () => {
    const user = await userRepository.registerUser({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "Senhaforte123@",
      imageUrl: "https://bucket.s3.amazonaws.com/avatar.jpg",
      cognitoId: faker.string.uuid(),
    });

    const result = await sut.execute(user.id);

    const deletedUser = await userRepository.findById(user.id);

    expect(result).toEqual({ message: "User deleted successfully" });
    expect(deletedUser).toBeNull();
    expect(mockCognitoService.deleteUser).toHaveBeenCalledWith(user.email);
    expect(mockS3Service.deleteFile).toHaveBeenCalledTimes(1);
  });

  it("should throw if the user was not found", async () => {
    await expect(sut.execute(faker.string.uuid())).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
  });
});
