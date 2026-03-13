export class AuthenticationFailedError extends Error {
  constructor() {
    super("Authentication failed");
    this.name = "AuthenticationFailedError";
  }
}
