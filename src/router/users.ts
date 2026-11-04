import express from "express";
import { getAllUsers } from "../controllers/users.ts";
import { isAuthenticated } from "../middlewares/index.ts";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
};
