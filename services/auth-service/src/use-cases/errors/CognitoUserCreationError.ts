export class CognitoUserCreationError extends Error {
  constructor() {
    super("Error creating user in Cognito");
    this.name = "CognitoUserCreationError";
  }
}
