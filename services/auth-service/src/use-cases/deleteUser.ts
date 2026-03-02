import { CognitoService } from "../lib/aws/services/cognitoService";
import { S3Service } from "../lib/aws/services/s3Service";
import { UserRepository } from "../repositories/user-repository";
import path from "path";

export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private cognitoService: CognitoService,
    private s3Service: S3Service,
  ) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Deletar imagem do S3 se existir
    if (user.imageUrl) {
      const extension = path.extname(user.imageUrl) || "";
      const fileName = `${user.id}${extension}`;
      await this.s3Service.deleteFile(fileName);
    }

    // Deletar usuário do Cognito
    await this.cognitoService.deleteUser(user.email);

    // Deletar usuário do banco de dados
    await this.userRepository.deleteUser(id);

    return { message: "User deleted successfully" };
  }
}
