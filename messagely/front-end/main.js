import { add } from "./add.js";
const $registerForm = document.querySelector("#reg-form");
const $loginForm = document.querySelector("#login-form");

let JWT_TOKEN;

async function handleRegisterFormSubmit(evt) {
  evt.preventDefault();
  
  const username = document.querySelector("#reg-username").value;
  const password = document.querySelector("#reg-password").value;
  const firstName = document.querySelector("#reg-first-name").value;
  const lastName = document.querySelector("#reg-last-name").value;
  const phoneNumber = document.querySelector("#reg-phone").value;
  
  const bodyData = {
    username: username, 
    password: password,
    first_name: firstName,
    last_name: lastName,
    phone: phoneNumber
  }
  
  const response = await fetch(
    "http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    } 
  );
  
  $registerForm.reset();
  
  JWT_TOKEN = await response.json();
  
  putDataOnPage(JWT_TOKEN);
}
$registerForm.addEventListener("submit", handleRegisterFormSubmit);



async function handleLoginFormSubmit(){
  const username = document.querySelector("#login-username").value;
  const password = document.querySelector("#login-password").value;
  
  const bodyData = {
    username,
    password
  }
  
  
}
$loginForm.addEventListener("submit", handleLoginFormSubmit);


function putDataOnPage(data){
  const dataArea = document.querySelector("#data-area");
  dataArea.innerHTML = data.token;
}


function start() {
  
}

start();
