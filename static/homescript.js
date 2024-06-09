// LAB5-hoz
window.onload = () => {
  const classes = document.getElementsByClassName('classcode');

  Array.from(classes).forEach((classElement) => {
    classElement.addEventListener('click', async () => {
      let data;
      try {
        const classCode = classElement.getAttribute('classcode');
        const res = await fetch(`/getDetail?classcode=${JSON.stringify(classCode)}`);
        if (res.status !== 200) {
          data = await res.json();
        } else {
          const message = await res.json();
          data = `YearFor: ${message.yearFor}, CourseNumber: ${message.coursesNum}, SeminarNumber: ${message.seminarNum}, LabNumber: ${message.labNum}, Owner: ${message.classOwner}`;
        }
        document.getElementById(classCode).innerText = data;
      } catch (err) {
        console.log(err);
      }
    });
  });
};
