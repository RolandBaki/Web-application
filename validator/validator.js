export function checkIfGiven(ClassCode, ClassName, CourseNum, SeminarNum, LabNum, Ev) {
  let myStatus = 200;
  let myMessage = `YOU INSERTED ${ClassName} with a code ${ClassCode}`;

  if (!ClassCode) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE YOUR ID';
  }

  if (!ClassName) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE A CLASS NAME';
  }

  if (!CourseNum) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE COURSE NUM';
  }

  if (!SeminarNum) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE SEMINAR NUM';
  }

  if (!LabNum) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE LAB NUM';
  }

  if (!Ev) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE YEAR';
  }

  return { myStatus, myMessage };
}

export function goodNumbersAtAddClass(ev, courseNum, seminarNum, labNum, myStatus, myMessage) {
  if (ev < 1 || ev > 4) {
    myStatus = 400;
    myMessage = 'NOT INSERTED: Invalid Year';
  }
  if (courseNum < 5 || courseNum > 14) {
    myStatus = 400;
    myMessage = 'NOT INSERTED: Invalid Course Number';
  }
  if (seminarNum < 2 || seminarNum > 8) {
    myStatus = 400;
    myMessage = 'NOT INSERTED: Invalid Seminar Number';
  }
  if (labNum < 2 || labNum > 8) {
    myStatus = 400;
    myMessage = 'NOT INSERTED: Invalid Lab Number';
  }

  return { myStatus, myMessage };
}
export function checkIfGivenCodeId(classCode, yourID, myStatus, myMessage) {
  if (!yourID) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE YOUR ID';
  }
  if (!classCode) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE A CLASSCODE';
  }
  return { myStatus, myMessage };
}

export function isGivenFile(file, myStatus, myMessage) {
  if (!file) {
    myStatus = 400;
    myMessage = 'PLEASE ADD A FILE';
  }
  return { myStatus, myMessage };
}
export function checkIfGivenSignUp(name, nickName, email, passwordUp, passwordUp1) {
  let myStatus = 200;
  let myMessage = 'YOU REGISTERED SUCCESSFULLY';
  if (!name) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE NAME';
  }
  if (!nickName) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE NICKNAME';
  }
  if (!email) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE EMAIL';
  }
  if (!passwordUp) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE PASSWORD';
  }
  if (!passwordUp1) {
    myStatus = 400;
    myMessage = 'PLEASE REPEAT THE PASSWORD';
  }

  return { myStatus, myMessage };
}

export function checkIfGivenSignIn(name, code) {
  let myStatus = 200;
  let myMessage = `WELCOME ${name}`;
  if (!name) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE NAME';
  }
  if (!code) {
    myStatus = 400;
    myMessage = 'PLEASE GIVE THE PASSWORD';
  }

  return { myStatus, myMessage };
}
