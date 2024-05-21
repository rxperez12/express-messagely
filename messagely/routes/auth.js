import express from "express";
import { BadRequestError, UnauthorizedError } from "../expressError.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

const router = new express.Router();

/** POST /login: {username, password} => {token} */

router.post("/login", async function (req, res) {
  if (!req.body) throw new BadRequestError();
  const { username, password } = req.body;

  if (await User.authenticate(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY);
    return res.json({ token });
  }
  else {
    throw new UnauthorizedError("Invalid username/password");
  }
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

router.post("/register", async function (req, res) {
  if (!req.body) throw new BadRequestError();
  let newUser;

  try {
    const { username, password, first_name, last_name, phone } = req.body; // BETTER STYLE to use destructuring

    newUser = await User.register({
      username,
      password,
      first_name,
      last_name,
      phone
    });
  } catch (err) {
    throw new BadRequestError(`Could not create user ${err}`);
  }

  const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
  return res.json({ token });
});

export default router;
