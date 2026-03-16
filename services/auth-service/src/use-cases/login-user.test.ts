import { beforeEach, describe, expect, it, vi } from "vitest";
import { CognitoService } from "../lib/aws/services/cognitoService";
import { InMemoryAuthRepository } from "../repositories/in-memory/in-memory-auth-repository";
import { LoginUserUseCase } from "./loginUser";
import { AuthenticationFailedError, UserNotFoundError } from "./errors";
import { faker } from "@faker-js/faker";

let userRepository: InMemoryAuthRepository;
let sut: LoginUserUseCase;

describe("Login Use Case", () => {
  const mockCognitoService: CognitoService = {
    signUp: vi.fn().mockResolvedValue({ UserSub: faker.string.uuid() }),
    login: vi.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: faker.internet.jwt(),
        IdToken: faker.internet.jwt(),
        RefreshToken: faker.internet.jwt(),
      },
    }),
    logout: vi.fn().mockResolvedValue(undefined),
    deleteUser: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = new InMemoryAuthRepository();
    sut = new LoginUserUseCase(userRepository, mockCognitoService);
  });

  it("should be able to login", async () => {
    const email = faker.internet.email();
    const password = "Senhaforte1234@";

    await userRepository.registerUser({
      name: faker.person.fullName(),
      email,
      password,
      cognitoId: faker.string.uuid(),
      imageUrl: faker.image.url(),
    });

    const result = await sut.execute({ email, password });

    expect(result.user.email).toBe(email);
    expect(result.tokens).toEqual(
      expect.objectContaining({
        AccessToken: expect.any(String),
        IdToken: expect.any(String),
        RefreshToken: expect.any(String),
      }),
    );
  });

  it("should throw UserNotFoundError when the user does not exist", async () => {
    await expect(
      sut.execute({
        email: faker.internet.email(),
        password: "Senhaforte1234@",
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("should throw AuthenticationFailedError when Cognito returns no auth result", async () => {
    const email = faker.internet.email();
    const password = "Senhaforte1234@";

    await userRepository.registerUser({
      name: faker.person.fullName(),
      email,
      password,
      cognitoId: faker.string.uuid(),
      imageUrl: faker.image.url(),
    });

    vi.mocked(mockCognitoService.login).mockResolvedValueOnce(undefined as any);

    await expect(sut.execute({ email, password })).rejects.toBeInstanceOf(
      AuthenticationFailedError,
    );
  });
});
