import express from 'express';
import path from 'path';
import morgan from 'morgan';
import session from 'express-session';
import fileHandleRouter from './router/file.router.js';
import classHandleRouter from './router/class.router.js';
import userHandleRouter from './router/user.router.js';
import loginHandleRouter from './router/login.router.js';
import { createDatabase } from './DB/database.js';

const app = express();

app.use(express.static(path.join(process.cwd(), 'static')));
app.use(
  session({
    secret: '142e6ecf42884f03',
    resave: false,
    saveUninitialized: false,
  }),
);

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(morgan('tiny'));

app.use(fileHandleRouter);
app.use(userHandleRouter);
app.use(classHandleRouter);
app.use(loginHandleRouter);

app.listen(8080, () => {
  createDatabase();
  console.log('start');
});
