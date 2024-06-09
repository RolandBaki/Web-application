window.onload = () => {
  document.getElementById('backbutton').addEventListener('click', () => {
    window.location.href = '/';
  });

  // LAB5-hoz
  const buttons = document.getElementsByClassName('delete');
  Array.from(buttons).forEach((fileDelete) => {
    fileDelete.addEventListener('click', async () => {
      try {
        const filePath = fileDelete.getAttribute('filepath');
        const myClass = fileDelete.getAttribute('classcode');
        const res = await fetch(`/deleteFile/?path=${JSON.stringify(filePath)}&classcode=${JSON.stringify(myClass)}`, {
          method: 'DELETE',
        });
        const message = await res.json();
        if (message === 'File deleted successfully') {
          document.getElementById(`${filePath}`).style.display = 'none';
          document.getElementById(`${filePath}link`).style.display = 'none';
        }
        document.getElementById('message').innerText = message;
      } catch (err) {
        console.log(err);
        document.getElementById('message').innerText = 'Something went wrong';
      }
    });
  });
};
