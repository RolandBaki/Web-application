import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { addFile, deleteFile } from '../DB/database.js';
import { isGivenFile } from '../validator/validator.js';
import { loadMessage } from '../helper/helper.js';
import multerUpload from '../middleware/multerConf.js';
import authMiddleware, { ownerMiddleware, ownerMiddlewareAtDelete } from '../middleware/auth.js';

const router = express.Router();

router.use(['/UploadedFiles', '/deleteFile'], express.static(path.join(path.resolve(), 'UploadedFiles')));

router.post('/AddFileP/:code', authMiddleware, ownerMiddleware, multerUpload.single('fileupload'), async (req, res) => {
  const classCode = req.params.code;
  const { file } = req;
  let myStatus = 200;
  let myMessage = `YOU UPLOADED ${file.originalname} IN CLASS WITH ID: ${classCode}`;

  ({ myStatus, myMessage } = isGivenFile(file, myStatus, myMessage));

  if (myStatus === 200) {
    await addFile(classCode, file.path, file.originalname);
  } else if (file) {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error while deleting file:', err);
      }
    });
  }
  loadMessage(res, myMessage, myStatus);
  return 0;
});

// LAB5-hoz
router.delete(
  '/deleteFile',
  authMiddleware,
  ownerMiddlewareAtDelete,
  bodyParser.urlencoded({ extended: true }),
  async (req, res) => {
    let filePath = req.query.path;
    let myClass = req.query.classcode;
    if (filePath === undefined) {
      res.status(400).json({ error: 'Give us a FILE' });
      return;
    }

    if (myClass === undefined) {
      res.status(400).json({ error: 'Give us a CLASS' });
      return;
    }
    filePath = JSON.parse(filePath);
    myClass = JSON.parse(myClass);
    const absoluteFilePath = path.resolve(filePath);
    if (!(await deleteFile(myClass, filePath))) {
      res.status(404).json({ error: 'This file may not be part of the given class' });
      return;
    }
    fs.unlink(absoluteFilePath, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting file' });
      } else {
        res.json('File deleted successfully');
      }
    });
  },
);

export default router;
