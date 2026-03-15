import { describe, expect, it, vi, beforeEach } from "vitest";
import { UserRepository } from "../repositories/user-repository";
import { CreateUserUseCase } from "./createUser";
import { InMemoryAuthRepository } from "../repositories/in-memory/in-memory-auth-repository";
import { S3Service } from "../lib/aws/services/s3Service";
import { CognitoService } from "../lib/aws/services/cognitoService";
import { faker } from "@faker-js/faker";
import { UserAlreadyExistsError } from "./errors";
import { CognitoUserCreationError, ImageUploadError } from "./errors";

let userRepository: UserRepository;
let sut: CreateUserUseCase;

const mockS3Service: S3Service = {
  uploadFile: vi
    .fn()
    .mockResolvedValue(
      "https://fake-bucket.s3.fake-region.amazonaws.com/uploads/fake-file.jpg",
    ),
  deleteFile: vi.fn().mockResolvedValue(undefined),
};

const mockCognitoService: CognitoService = {
  signUp: vi.fn().mockResolvedValue({ UserSub: faker.string.uuid() }),
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  deleteUser: vi.fn().mockResolvedValue(undefined),
};

const fakeMulterFile: Express.Multer.File = {
  fieldname: "photo",
  originalname: faker.system.fileName(),
  encoding: "7bit",
  mimetype: "image/jpeg",
  buffer: Buffer.from("fake content"),
  size: 1024,
  stream: null as any,
  destination: "",
  filename: faker.system.fileName(),
  path: "",
};

describe("Auth Use Case", () => {
  vi.clearAllMocks();
  beforeEach(() => {
    userRepository = new InMemoryAuthRepository();
    sut = new CreateUserUseCase(
      userRepository,
      mockCognitoService,
      mockS3Service,
    );
  });

  it("should create an user", async () => {
    const user = await sut.execute(
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "Senhaforte1234@",
        cognitoId: faker.string.uuid(),
        imageUrl: faker.image.url(),
      },
      fakeMulterFile,
    );

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not create an user with an existing email", async () => {
    await sut.execute(
      {
        name: faker.person.fullName(),
        email: "fulando@gmail.com",
        password: "Senhaforte1234@",
        cognitoId: faker.string.uuid(),
        imageUrl: faker.image.url(),
      },
      fakeMulterFile,
    );

    await expect(async () => {
      await sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "Senhaforte1234@",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      );
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it("should not be able to create an account with an invalid email", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulandogmail.com",
          password: "Senhaforte1234@",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Please, provide a valid email");
  });

  it("should not be able to create an account without an email", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "",
          password: "Senhaforte1234@",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Email is required");
  });

  it("should not be able to create an account without a password", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must be at least 8 characters long");
  });

  it("should not be able to create an account if the password is too short", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "2!Curto",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must be at least 8 characters long");
  });

  it("should not be able to create an account if the password does not contain an uppercase letter", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "2!curto",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must contain at least 1 uppercase letter");
  });

  it("should not be able to create an account if the password does not contain an special character", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "2curt1",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must contain at least 1 special character");
  });

  it("should not be able to create an account if the password does not contain an lowercase letter", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "2@CALSFDSGC",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must contain at least 1 lowercase letter");
  });

  it("should not be able to create an account if the password does not contain an number", async () => {
    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: "fulando@gmail.com",
          password: "@CALSFDSGC",
          cognitoId: faker.string.uuid(),
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toThrow("Password must contain at least 1 number");
  });

  it("should throw when cognito user creation fails", async () => {
    vi.mocked(mockCognitoService.signUp).mockResolvedValueOnce(
      undefined as any,
    );

    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "Senhaforte1234@",
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toBeInstanceOf(CognitoUserCreationError);
  });

  it("should throw when image upload fails", async () => {
    vi.mocked(mockS3Service.uploadFile).mockResolvedValueOnce(undefined as any);

    await expect(
      sut.execute(
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "Senhaforte1234@",
          imageUrl: faker.image.url(),
        },
        fakeMulterFile,
      ),
    ).rejects.toBeInstanceOf(ImageUploadError);
  });
});
