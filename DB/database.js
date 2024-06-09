import mysql from 'mysql2';

const pool = mysql
  .createPool({
    connectionLimit: 10,
    database: 'University',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
  })
  .promise();

export async function createUsers() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY UNIQUE,
    email VARCHAR(255) UNIQUE,
    fullname VARCHAR(255),
    passwordsalt VARCHAR(255)
  );
  `);
}

export async function createClasses() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS classes (
    classCode VARCHAR(255) PRIMARY KEY,
    className VARCHAR(255),
    yearFor INT,
    coursesNum INT,
    seminarNum INT,
    labNum INT,
    classOwner VARCHAR(255),
    FOREIGN KEY (classOwner) REFERENCES users(id)
);
  `);
}

export async function createFiles() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS files (
    fName VARCHAR(255) PRIMARY KEY,
    classCode VARCHAR(255),
    name VARCHAR(255),
    FOREIGN KEY (classCode) REFERENCES classes(classCode)
  );
  `);
}
export async function createRegist() {
  await pool.query(`
  CREATE TABLE IF NOT EXISTS regist (
    classCode VARCHAR(255),
    userId VARCHAR(255),
    joinDate DATETIME,
    CONSTRAINT PK_ID PRIMARY KEY (classCode, userId),
    FOREIGN KEY (classCode) REFERENCES classes(classCode),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
  `);
}

export async function createDatabase() {
  await createUsers();
  await createClasses();
  await createFiles();
  await createRegist();
}

export async function getClasses() {
  const [rows] = await pool.query('SELECT * FROM classes');
  return rows;
}

export async function getUsers() {
  const [rows] = await pool.query('SELECT id FROM users');
  return rows;
}

export async function getClassCodes() {
  const [rows] = await pool.query('SELECT classCode FROM classes');
  return rows;
}
export async function getFilesFrom(ClassCode) {
  const row = await pool.query('SELECT * FROM files WHERE classcode=?', [ClassCode]);
  return row[0];
}
export async function getClass(Classcode) {
  let row;
  try {
    [row] = await pool.query('SELECT * FROM classes WHERE classes.classcode=?', [Classcode]);
  } catch (err) {
    return 'error';
  }
  return row[0];
}

export async function addClass(classCode, className, ev, courseNum, seminarNum, labNum, owner) {
  const result = await pool.query(
    `
    INSERT INTO classes (classCode, className, yearFor, coursesNum, seminarNum, labNum, classOwner)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [classCode, className, ev, courseNum, seminarNum, labNum, owner],
  );
  return result;
}

export async function addUser(name, nickName, emial, passwsalt) {
  let result;
  try {
    result = await pool.query(
      `
    insert into users(id,email,fullname,passwordsalt) VALUES(?,?,?,?)
      `,
      [name, nickName, emial, passwsalt],
    );
  } catch (err) {
    result = 'error';
  }
  return result;
}

export async function addFile(classCode, file, name) {
  const result = await pool.query(
    `
    INSERT INTO files (fName, classCode, name)
    VALUES (?, ?, ?)
    `,
    [file, classCode, name],
  );
  return result;
}

export async function addRegistration(id, cc) {
  let result;
  try {
    result = await pool.query(
      `
      INSERT INTO regist (classCode,userID,joinDate)
      VALUES (?,?,NOW())
      `,
      [id, cc],
    );
  } catch (err) {
    result = 'error';
  }
  return result;
}

export async function deleteRegistration(id, cc) {
  const result = await pool.query(
    `
    DELETE FROM regist WHERE classCode = ? AND userID = ?;
    `,
    [id, cc],
  );
  return result[0].affectedRows > 0;
}

export async function deleteFile(classCode, file) {
  const result = await pool.query(
    `
    DELETE FROM files WHERE fName= ? AND classCode = ?
    `,
    [file, classCode],
  );
  return result[0].affectedRows > 0;
}

export async function deleteUser(id) {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id = ?
      `,
    [id],
  );
  return result.affectedRows > 0;
}

export async function deleteClass(classCode) {
  const result = await pool.query(
    `
    DELETE FROM classes WHERE classCode = ? 
    `,
    [classCode],
  );
  return result.affectedRows > 0;
}

export async function isUserID(id) {
  try {
    const result = await pool.query(
      `
      SELECT 1 FROM users WHERE id = ?
      `,
      [id],
    );
    if (result[0].length > 0) return true;
    return false;
  } catch (err) {
    console.error('Error checking if ID is in use:', err);
    return 'error';
  }
}

export async function isUserEmail(email) {
  try {
    const result = await pool.query(
      `
      SELECT 1 FROM users WHERE email = ?
      `,
      [email],
    );
    if (result[0].length > 0) return true;
    return false;
  } catch (err) {
    console.error('Error checking if ID is in use:', err);
    return 'error';
  }
}

export async function getPass(id) {
  const [row] = await pool.query('SELECT passwordsalt FROM users WHERE ? = users.id', [id]);
  return row[0];
}
