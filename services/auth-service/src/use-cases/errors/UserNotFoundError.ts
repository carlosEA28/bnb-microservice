export class UserNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `User ${identifier} not found` : "User not found");
    this.name = "UserNotFoundError";
  }
}
