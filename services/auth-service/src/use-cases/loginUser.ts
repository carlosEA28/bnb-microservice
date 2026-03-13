import { LoginDto } from "../dtos/loginDTO";
import { CognitoService } from "../lib/aws/services/cognitoService";
import { UserRepository } from "../repositories/user-repository";
import { AuthenticationFailedError, UserNotFoundError } from "./errors";

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private cognitoService: CognitoService,
  ) {}

  async execute(params: LoginDto) {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) {
      throw new UserNotFoundError(params.email);
    }

    const auth = await this.cognitoService.login(params.email, params.password);

    if (!auth || !auth.AuthenticationResult) {
      throw new AuthenticationFailedError();
    }

    return { tokens: auth.AuthenticationResult, user };
  }
}
