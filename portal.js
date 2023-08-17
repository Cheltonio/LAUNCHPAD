let accounts = []; let inputs; 

const users = firebase.database().ref('Users');
users.on("child_added",function(childSnapshot, prevChildKey) {
  accounts.push({
    user: childSnapshot.key,
    pass: childSnapshot.val().password
  });
});

const registerScreen = document.getElementById("register");
const signupButton = document.getElementById("signupButton");
const loginButton = document.getElementById("loginButton");
const aboutButton = document.getElementById("aboutButton");

signupButton.onclick = function() {
  registerScreen.style.display = "none";
  signupScreen.style.display = "flex";
  inputs = document.getElementsByClassName("inputS");
}
loginButton.onclick = function() {
  window.location.assign('main.html');
}

let signupScreen = document.getElementById("signup");
let createAccount = document.getElementById("create");

createAccount.onclick = function() {

  if(inputs[0].value=="" || inputs[1].value=="" || inputs[2].value=="") {
    alert("Please fill out all fields");
    inputs[1].value = ""; inputs[2].value = "";
  }
  if(inputs[1].value != inputs[2].value) {
    alert("Please make sure your passwords match");
    inputs[1].value = ""; inputs[2].value = "";
    return;
  }
  
  if (!accountExists(inputs[0].value)){
    users.child(inputs[0].value).set({
      password: inputs[1].value,
      bio: ""
    })
    window.location.assign('main.html');
  }
  else {
    inputs[0].value = "";
    alert("That username is taken please try again")
  }
}

function accountExists(n) {
  for(let i=0; i<accounts.length; i++) {
    if(accounts[i].user==n) return true;
  }
  return false;
}

function accountFind(n) {
  for(let i=0; i<accounts.length; i++) {
    if(accounts[i].user==n) return accounts[i].pass;
  }
  return -1;
}
