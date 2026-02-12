import {
  SignUpCommand,
  AdminInitiateAuthCommand,
  GlobalSignOutCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../cognitoClient";
import { createHmac } from "crypto";
import { env } from "../../../env/env";

function generateSecretHash(username: string): string | undefined {
  const clientId = env.COGNITO_CLIENT_ID;
  const clientSecret = env.COGNITO_SECRET;
  if (!clientId || !clientSecret) return undefined;

  return createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export class CognitoService {
  async signUp(email: string, password: string) {
    const secretHash = generateSecretHash(email);

    return cognitoClient.send(
      new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        ...(secretHash ? { SecretHash: secretHash } : {}),
      }),
    );
  }

  async login(email: string, password: string) {
    const secretHash = generateSecretHash(email);

    return cognitoClient.send(
      new AdminInitiateAuthCommand({
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID!,
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          ...(secretHash ? { SECRET_HASH: secretHash } : {}),
        },
      }),
    );
  }

  async logout(accessToken: string) {
    if (!accessToken) {
      throw new Error("Access token is required to logout");
    }

    return cognitoClient.send(
      new GlobalSignOutCommand({
        AccessToken: accessToken,
      }),
    );
  }

  async deleteUser(email: string) {
    return cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID!,
        Username: email,
      }),
    );
  }
}
