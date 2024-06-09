window.onload = () => {
  const signUp = document.getElementById('signUp');
  const signIn = document.getElementById('signIn');

  const signUpSwitch = document.getElementById('signupswitch');
  const signInSwitch = document.getElementById('signinswitch');

  signUpSwitch.addEventListener('click', () => {
    signIn.style.display = 'none';
    signUp.style.display = '';
  });

  signInSwitch.addEventListener('click', () => {
    signIn.style.display = '';
    signUp.style.display = 'none';
  });
};
