import express from "express";
import { createUser, getUsersByEmail } from "../db/users.ts";
import { random, authentication } from "../helpers/index.ts";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUsersByEmail(email).select(
      "+authentication.salt +authentication.password",
    );

    if (!user) {
      return res.sendStatus(404);
    }

    const userAuthentication = user.authentication;

    if (userAuthentication?.salt == null) {
      return res.sendStatus(403);
    }

    const expectedHash = authentication(userAuthentication.salt, password);

    if (userAuthentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();

    userAuthentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie("SHIV-REST-API", user.authentication?.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUsersByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      username,
      email,
      password,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
