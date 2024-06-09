import express from 'express';
import bodyParser from 'body-parser';
import { getClass, deleteRegistration, addRegistration } from '../DB/database.js';
import { checkIfGivenCodeId } from '../validator/validator.js';
import { getUsersAndClasses, loadMessage } from '../helper/helper.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/LeaveClass', authMiddleware, async (req, res) => {
  const { users2, classes2 } = await getUsersAndClasses();
  try {
    res.status(200).render('leaveclass', { users: users2, classes: classes2, userName: req.session.userName || 0 });
  } catch (err) {
    console.error('Error rendering EJS template:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/JoinClass', authMiddleware, async (req, res) => {
  const { users2, classes2 } = await getUsersAndClasses();
  try {
    res.status(200).render('joinclass', { users: users2, classes: classes2, userName: req.session.userName || 0 });
  } catch (err) {
    console.error('Error rendering EJS template:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/JoinClass', authMiddleware, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const classCode = req.body.classcode;
  const yourID = req.body.yourid;
  let myStatus = 200;
  let myMessage = `YOU JOINED ${classCode} WITH THE ID ${yourID}`;
  ({ myStatus, myMessage } = checkIfGivenCodeId(classCode, yourID, myStatus, myMessage));
  if (myStatus === 200) {
    const result = await addRegistration(classCode, yourID);
    if (result === 'error') {
      myStatus = 400;
      myMessage = 'YOU ARE ALLREADY IN THIS CLASS';
    }
  }
  loadMessage(res, myMessage, myStatus);
  return 0;
});

router.post('/LeaveClass', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const classCode = req.body.classcode;
  const yourID = req.body.yourid;
  let myStatus = 200;
  let myMessage = `YOU LEFT ${classCode} WITH THE ID ${yourID}`;

  ({ myStatus, myMessage } = checkIfGivenCodeId(classCode, yourID, myStatus, myMessage));

  if (!(await deleteRegistration(classCode, yourID))) {
    myStatus = 400;
    myMessage = `YOU ARE NOT IN CLASS: ${classCode} WITH ID: ${yourID}`;
  }
  try {
    await getClass(classCode);
  } catch (err) {
    myStatus = 404;
    myMessage = `NO CLASS WITH ID: ${classCode} `;
  }
  loadMessage(res, myMessage, myStatus);
  return 0;
});

export default router;
