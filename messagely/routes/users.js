import { Router } from "express";
import User from "../models/user.js";
import { ensureLoggedIn, ensureCorrectUser } from "../middleware/auth.js";

const router = new Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name}, ...]}
 *
 **/
router.get('/', ensureLoggedIn, async function (req, res, next) {
  const users = await User.all();

  return res.json({ users });
});



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async function (req, res, next) {
  const username = req.params.username;
  const userDetails = await User.get(username);

  return res.json({ user: userDetails });
});


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async function (req, res, next) {
  const username = req.params.username;
  const messagesTo = await User.messagesTo(username);

  return res.json({ messages: messagesTo });

});



/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async function (req, res, next) {
  const username = req.params.username;
  const messagesFrom = await User.messagesFrom(username);

  return res.json({ messages: messagesFrom });
});

export default router;