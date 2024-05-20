import express from "express";
import { BadRequestError, UnauthorizedError } from "../expressError.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

const router = new express.Router();

/** POST /login: {username, password} => {token} */

router.post("/login", async function(req, res){
  if (!req.body) throw new BadRequestError();
  const {username, password} = req.body;
  
  if(await User.authenticate(username, password)){
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

router.post("/register", async function(req, res){
  if (!req.body) throw new BadRequestError();
  
  const newUser = await User.register(
    req.body.username,
    req.body.password,
    req.body.first_name,
    req.body.last_name,
    req.body.phone
  );
  
  const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
  return res.json({ token });
});

export default router;
