import fs from 'fs';
import multer from 'multer';

const uploadDir = 'UploadedFiles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const multerUpload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default multerUpload;
