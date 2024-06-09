import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import { checkIfGivenSignUp, checkIfGivenSignIn } from '../validator/validator.js';
import { isUserID, isUserEmail, addUser, getPass } from '../DB/database.js';
import { loadMessage } from '../helper/helper.js';

const router = express.Router();
const staticDir = path.join(process.cwd(), './static');

router.get('/LogIn', (req, res) => {
  res.sendFile(path.join(staticDir, '../public/login.html'));
});

router.post('/signUp', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const { name, nickName, email, passwordUp, passwordUp1 } = req.body;
  let { myStatus, myMessage } = checkIfGivenSignUp(name, nickName, email, passwordUp, passwordUp1);
  if (await isUserID(nickName)) {
    loadMessage(res, 'This Nickname is already in use', 400);
  } else if (await isUserEmail(email)) {
    loadMessage(res, 'This Email is already in use', 400);
  } else if (passwordUp !== passwordUp1) {
    loadMessage(res, "PASSWORD DOESN'T MATCH", 400);
  } else {
    try {
      const salt = crypto.randomBytes(30);
      const hash = crypto.createHash('sha512').update(passwordUp).update(salt).digest();
      const hashWithSalt = `${hash.toString('base64')}:${salt.toString('base64')}`;

      const result = await addUser(nickName, email, name, hashWithSalt);

      if (result !== 'error') {
        myMessage = 'User successfully added';
      } else {
        myStatus = 400;
        myMessage = 'Error while adding the user';
      }
    } catch (err) {
      console.error('Error adding user:', err);
      myStatus = 500;
      myMessage = 'Internal Server Error';
    }
    if (myStatus === 200) req.session.userName = nickName;
    loadMessage(res, myMessage, myStatus);
  }
});

router.post('/signIn', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const { nickNameIn, passwordIn } = req.body;
  let { myStatus, myMessage } = checkIfGivenSignIn(nickNameIn, passwordIn);
  if (myStatus !== 200) {
    loadMessage(res, myMessage, myStatus);
    return;
  }
  if (!(await isUserID(nickNameIn))) {
    loadMessage(res, `There is no user with this username: ${nickNameIn}`, 400);
  } else {
    const hashWithSalt = await getPass(nickNameIn);
    const [expectedHashB64, saltB64] = hashWithSalt.passwordsalt.split(':');
    const expectedHash = Buffer.from(expectedHashB64, 'base64');
    const salt = Buffer.from(saltB64, 'base64');
    const actualHash = crypto.createHash('sha512').update(passwordIn).update(salt).digest();
    if (!expectedHash.equals(actualHash)) {
      myStatus = 401;
      myMessage = 'Password it is not good';
    } else {
      req.session.userName = nickNameIn;
    }
    loadMessage(res, myMessage, myStatus);
  }
});

router.get('/logOut', (req, res) => {
  if (req.session.userName) {
    req.session.destroy((err) => {
      if (err) {
        loadMessage(res, 'NOT LOGGED OUT, TRY AGAIN', 500);
      } else {
        loadMessage(res, 'LOGGED OUT SUCCESSFULLY', 200);
      }
    });
  } else {
    loadMessage(res, 'NO USER LOGGED IN', 400);
  }
});

export default router;
