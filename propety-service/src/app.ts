import express from "express";
import { Approutes } from "./http/routes";

export const app = express();

app.use(express.json());
app.use(Approutes);
