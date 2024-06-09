import express from 'express';
import bodyParser from 'body-parser';
import { getClasses, getClass, addClass, getFilesFrom, createDatabase } from '../DB/database.js';
import { checkIfGiven, goodNumbersAtAddClass } from '../validator/validator.js';
import { loadMessage } from '../helper/helper.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.post('/AddClassP', authMiddleware, bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const classCode = req.body.classcode;
  const className = req.body.classname;
  const courseNum = parseInt(req.body.courses, 10);
  const seminarNum = parseInt(req.body.seminar, 10);
  const labNum = parseInt(req.body.lab, 10);
  const ev = parseInt(req.body.ev, 10);
  const { myStatus: newStatus, myMessage: newMessage } = checkIfGiven(
    classCode,
    className,
    courseNum,
    seminarNum,
    labNum,
    ev,
  );
  let myStatus = newStatus;
  let myMessage = newMessage;
  const { myStatus: newStatus1, myMessage: newMessage1 } = goodNumbersAtAddClass(
    ev,
    courseNum,
    seminarNum,
    labNum,
    myStatus,
    myMessage,
  );
  myStatus = newStatus1;
  myMessage = newMessage1;
  if ((await getClass(classCode)) !== undefined) {
    myStatus = 400;
    myMessage = `NOT INSERTED: Class allready exists with this ID: ${classCode} `;
  }
  if (myStatus === 200) {
    await addClass(classCode, className, ev, courseNum, seminarNum, labNum, req.session.userName);
  }
  loadMessage(res, myMessage, myStatus);
});

router.get('/Classes/:code', async (req, res) => {
  const myClass = await getClass(req.params.code);
  const files = await getFilesFrom(myClass.classCode);
  let files2 = null;
  if (files != null) {
    files2 = files.map((ok) => ({ name: ok.name, fName: ok.fName }));
  }
  try {
    res.status(200).render('oneclass', { myClass, files: files2, userName: req.session.userName || 0 });
  } catch (err) {
    console.error('Error rendering EJS template:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', async (req, res) => {
  await createDatabase();
  const classes = await getClasses();
  try {
    res.status(200).render('home', { classes, userName: req.session.userName || 0 });
  } catch (err) {
    console.error('Error rendering EJS template:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/AddClassP', authMiddleware, (req, res) => {
  res.status(200).render('addClassP.ejs', { userName: req.session.userName || 0 });
});

// LAB5-hoz
router.get('/getDetail', bodyParser.urlencoded({ extended: true }), async (req, res) => {
  const code = req.query.classcode;
  if (code === undefined) {
    res.status(400).json('Give a class');
    return;
  }

  const myClass = await getClass(JSON.parse(code));

  if (!myClass) {
    res.status(404).json('This class does not exists');
    return;
  }

  if (myClass === 'error') {
    res.status(500).json('error occured on server part');
    return;
  }

  res.status(200).json(myClass);
});

export default router;
