import express from "express";
import { ensureLoggedIn, ensureCorrectUser } from "../middleware/auth.js";
import { UnauthorizedError } from "../expressError.js";
import Message from "../models/message.js";

const router = new express.Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", ensureLoggedIn, async function (req, res) {
  const currentUser = res.locals.user.username;
  const msgID = req.params.id;
  const message = await Message.get(msgID);

  if (message.to_user.username !== currentUser
    && message.from_user.username !== currentUser) {
    throw new UnauthorizedError("You are not authorized to view this message");
  }

  return res.json({ message });
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async function (req, res) {
  const to_username = req.body.to_username;
  const from_username = res.locals.user.username;
  const body = req.body.body;

  const message = await Message.create({ from_username, to_username, body });
  return res.json({ message });
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", ensureLoggedIn, async function (req, res) {
  const currentUser = res.locals.user.username;
  const msgID = req.params.id;
  const message = await Message.get(msgID);
  
  if (currentUser !== message.to_user.username) {
    throw new UnauthorizedError("Not your message!");
  }

  const markMessageRead = await Message.markRead(msgID);
  
  return res.json({ message: markMessageRead });
});


export default router;