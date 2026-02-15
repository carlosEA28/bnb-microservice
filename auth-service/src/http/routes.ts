// src/http/routes.ts
import { Router } from "express";
import { createUser } from "./controller/createUser";
import { upload } from "./middlewares/multer";
import { login } from "./controller/loginUser";
import { logout } from "./controller/logoutUser";
import { deleteUser } from "./controller/deleteUser";

export const Approutes = Router();

Approutes.post("/users", upload.single("image"), createUser);
Approutes.delete("/users/:id", deleteUser);

// Sessions (login / logout)
Approutes.post("/sessions", login);
Approutes.delete("/sessions", logout);
Approutes.get("/users/test", (req, res) => {
  res.send("Hello World");
});
