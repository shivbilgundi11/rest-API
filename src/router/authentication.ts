import express from "express";
import { register } from "../controllers/authentication.ts";

export default (router: express.Router) => {
  router.post("/auth/register", register);
};
