import express from "express";
import { getUsers } from "../db/users.ts";

export const getAllUsers = async (
  _: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
