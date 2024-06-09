import { loadMessage } from '../helper/helper.js';
import { getClass } from '../DB/database.js';

export default function authMiddleware(req, res, next) {
  if (req.session.userName) {
    next();
    return;
  }
  res.status(403).redirect('/logIn');
  // loadMessage(res, 'YOU ARE NOT LOGGED IN', 401);
}

export async function ownerMiddleware(req, res, next) {
  if (req.session.userName === (await getClass(req.params.code)).classOwner) {
    next();
    return;
  }
  loadMessage(res, 'YOU ARE NOT THE OWNER OF THIS CLASS', 403);
}

export async function ownerMiddlewareAtDelete(req, res, next) {
  if (req.session.userName === (await getClass(JSON.parse(req.query.classcode))).classOwner) {
    next();
    return;
  }
  res.status(403).redirect('/logIn');
  // loadMessage(res, 'YOU ARE NOT THE OWNER OF THIS CLASS', 403);
}
