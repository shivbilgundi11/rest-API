import express from "express";

import { getUserBySessionToken } from "./../db/users.ts";
import merge from "lodash/merge.js";
import type { Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    identity?: { _id: Types.ObjectId };
  }
}

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies["SHIV-REST-API"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;

    const currentUserId = req.identity?._id;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
