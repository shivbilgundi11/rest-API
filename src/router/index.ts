import express from "express";
import authentication from "./authentication.ts";
import users from "./users.ts";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);

  return router;
};
