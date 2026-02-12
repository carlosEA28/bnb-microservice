import { Request, Response } from "express";
import { CognitoService } from "../../lib/aws/services/cognitoService";

export async function logout(request: Request, response: Response) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response
        .status(400)
        .json({ error: "Authorization header is required" });
    }

    const token = authHeader.replace("Bearer ", "");

    const cognitoService = new CognitoService();

    await cognitoService.logout(token);

    return response.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Failed to logout" });
  }
}
