import { getUsers, getClassCodes } from '../DB/database.js';

export function loadMessage(res, myMessage, myStatus) {
  try {
    res.status(myStatus).render('message', { message: myMessage });
  } catch (err) {
    console.error('Error rendering EJS template:', err);
    res.status(500).send('Internal Server Error');
  }
}

export async function getUsersAndClasses() {
  const users = await getUsers();
  const classes = await getClassCodes();
  let users2 = null;
  let classes2 = null;
  if (users != null) {
    users2 = users.map((ok) => ok.id);
  }
  if (classes != null) {
    classes2 = classes.map((ok) => ok.classCode);
  }
  return { users2, classes2 };
}
