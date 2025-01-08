'use strict';

const passwordsContainer = document.querySelector('.passwords');
const form = document.querySelector('.form');
const submitBtn = document.querySelector('.btn--submit');
const generateBtn = document.querySelector('.btn--generate');
const inputLogin = document.querySelector('.form__input--login');
const inputUrl = document.querySelector('.form__input--url');
const inputPassword = document.querySelector('.form__input--password');

const PASSWORDS_LIST = load() ?? [];

const PASSWORD_CRITERIA = {
   length: 14,
   numbers: 1,
   specialSymbol: 1,
}

function isPasswordValid(password) {
   let isValidLength = password.length >= PASSWORD_CRITERIA.length;
   let numbers = [...password].some(char => isFinite(Number(char)));
   let specialSymbols = /[^A-Za-z0-9]/.test(password);

   return isValidLength && numbers && specialSymbols;
}

function generatePassword() {
   const alphanumericComboStr = `${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`;
   const specialSymbols = `!@#$%^&*()\-+={}[\]:;'<>,.?\/|\\`;

   const password = alphanumericComboStr + specialSymbols.charAt(Math.floor(Math.random() * specialSymbols.length));

   return isPasswordValid(password) ? password : generatePassword();
}

function clearFields(...fields) {
   fields.forEach(field => field.value = '');
}

function load() {
   const storagePasswords = JSON.parse(localStorage.getItem('passwords')) ?? [];

   storagePasswords.forEach(item => {
      const { login, url, password } = item;

      const markup = `
         <div class="password">
            <p>login: ${login}</p>
            <p>url: ${url}</p>
            <p>password: ${password}</p>
         </div>
      `;

      passwordsContainer.insertAdjacentHTML('afterbegin', markup);
   });

   return storagePasswords;
}

function addPassword(login, url, password) {
   if (!isPasswordValid(password)) {
      alert('Password not secure enough');
      return;
   }

   const markup = `
      <div class="password">
         <p>login: ${login}</p>
         <p>url: ${url}</p>
         <p>password: ${password}</p>
      </div>
   `;

   passwordsContainer.insertAdjacentHTML('afterbegin', markup);
   PASSWORDS_LIST.push({ login, url, password });
   localStorage.setItem('passwords', JSON.stringify(PASSWORDS_LIST));
}

generateBtn.addEventListener('click', e => {
   e.preventDefault();

   inputPassword.value = '';
   inputPassword.value = generatePassword();
});

submitBtn.addEventListener('click', e => {
   e.preventDefault();

   const login = inputLogin.value;
   const url = inputUrl.value;
   const password = inputPassword.value;

   addPassword(login, url, password);
   clearFields(inputLogin, inputUrl, inputPassword);
});

form.addEventListener('submit', e => {
   e.preventDefault();

   const login = inputLogin.value;
   const url = inputUrl.value;
   const password = inputPassword.value;

   addPassword(login, url, password);
   clearFields(inputLogin, inputUrl, inputPassword);
});