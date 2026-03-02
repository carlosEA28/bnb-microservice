import { CreateUserDto } from "../dtos/createUserDTO";
import { CognitoService } from "../lib/aws/services/cognitoService";
import { S3Service } from "../lib/aws/services/s3Service";
import { UserRepository } from "../repositories/user-repository";
import path from "path";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private cognitoService: CognitoService,
    private s3Service: S3Service,
  ) {}

  async execute(params: CreateUserDto, file: Express.Multer.File) {
    const userExists = await this.userRepository.findByEmail(params.email);

    if (userExists) {
      // fazer erro custom
      throw new Error("User already exists");
    }

    const cognitoID = await this.cognitoService.signUp(
      params.email,
      params.password!,
    );

    if (!cognitoID) {
      throw new Error("Error creating user in Cognito");
    }

    // create user first to obtain user id to use as file name
    const user = await this.userRepository.registerUser({
      name: params.name,
      email: params.email,
      password: params.password,
      cognitoId: cognitoID.UserSub!,
    });

    const extension = path.extname(file.originalname) || "";
    const fileName = `${user.id}${extension}`;

    const imageUrl = await this.s3Service.uploadFile(
      fileName,
      file.buffer,
      file.mimetype,
    );

    if (!imageUrl) {
      throw new Error("Error uploading image to S3");
    }

    const updatedUser = await this.userRepository.updateUserImage(
      user.id,
      imageUrl,
    );

    return updatedUser;
  }
}
