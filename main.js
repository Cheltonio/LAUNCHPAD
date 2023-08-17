const users = firebase.database().ref('Users');
users.on("child_added",function(childSnapshot, prevChildKey) {
  accounts.push({
    user: childSnapshot.key,
    pass: childSnapshot.val().password
  });
});

const posts = firebase.database().ref('Posts'); 
posts.on("child_added",displayPost);  

let accounts = []; let last = [home];
let inputs = document.getElementsByClassName("inputL");

signin.onclick = function() {
  if(inputs[0].value=="" || inputs[1].value=="") alert("Please fill out both fields");
  
  if(inputs[1].value == accountFind(inputs[0].value)) {
    alert(`You are logged in as ${inputs[0].value}`);
    document.getElementById("login").style.display = "none";
    document.querySelector("footer").style.display = "flex";
    navBar.style.display = "flex";
    username = inputs[0].value; 
    document.getElementById("profileName").innerHTML = username;
    users.child(username+'/bio').on('value', function(dataSnapshot) {
        bio.innerHTML = dataSnapshot.val();
      });
    posts.on("child_added",displayMyPosts);
    toHome();
  }
  else {
    alert("Your username or password is incorrect. Please try again");
  }
}
function accountFind(n) {
  for(let i=0; i<accounts.length; i++) {
    if(accounts[i].user==n) return accounts[i].pass;
  }
  return -1;
}

document.getElementById("toHome").onclick = toHome;
function toHome() {
  last[0].style.display = "none";
  home.style.display = "flex";
  last[0] = home;
}
document.getElementById("toAllPosts").onclick = function() {
  last[0].style.display = "none";
  allPosts.style.display = "flex";
  last[0] = allPosts;
}
document.getElementById("toAboutUs").onclick = function() {
  last[0].style.display = "none";
  aboutUs.style.display = "flex";
  last[0] = aboutUs;
}
document.getElementById("signout").onclick = function() {
  name = "";
  window.location.replace("index.html");
}

document.getElementById("toProfile").onclick = function() {
  last[0].style.display = "none";
  profile.style.display = "flex";
  last[0] = profile;
}
document.getElementById("editBio").onclick = function() {
  if(bio.style.display=="none") {
    bio.style.display = 'flex'; 
    changeBio.style.display = 'none';
    users.child(`${username}/bio`).set(changeBio.value);
    return;
  }
  bio.style.display = "none";
  changeBio.style.display = "flex"; changeBio.value = bio.innerHTML;
}

document.getElementById("toMakePost").onclick = function() {
  last[0].style.display = "none";
  makePost.style.display = "flex";
  last[0] = makePost;
}
title.oninput = function() {
  if(title.value.length>18) title.value = title.value.slice(0,title.value.length-1);
  else titleV.innerHTML = title.value;
}
type.oninput = function() {
  typeV.innerHTML = type.value;
}
link.oninput = function() {
  pic.src = link.value;
}
let descV = document.getElementById("descV");
desc.addEventListener("keydown", function(event) {
  if (event.key == "Enter") descV.innerHTML += "<br />";
  else if(event.key == "Backspace") {
    if(descV.innerHTML.slice(descV.innerHTML.length-6).localeCompare("&nbsp;") == 0) {
      descV.innerHTML = descV.innerHTML.slice(0,descV.innerHTML.length-6); 
    }
    else descV.innerHTML = descV.innerHTML.slice(0,descV.innerHTML.length-1); 
  }
  else if(event.key == " ") descV.innerHTML += "&nbsp;";
  else if(event.key.length==1) descV.innerHTML += event.key;
});
submit.onclick = function() {
  let date = new Date();

  const value = {
    user: username,
    time: {
      m: date.getMonth(),
      d: date.getDate(),
      yr: date.getFullYear()
    },
    img: link.value,
    title: title.value,
    type: type.value,
    desc: desc.value,
  }

  link.value = "";
  title.value = "";
  desc.value = "";
  descV.innerHTML = "";

  posts.push(value);
  toHome();
}

function displayPost(rowData) {
  let data = rowData.val();
  
  let post = document.createElement("div"); post.className = "post actualPost"; post.id = rowData.key;
  
  let pic = document.createElement("img"); pic.src = data.img; pic.className = "pic img"; 
  
  let text = document.createElement("div"); text.className = "info";
  let head = document.createElement("div"); head.className = "head";
  let user = document.createElement("h4"); user.innerHTML = '@' + data.user;
  let date = document.createElement("p"); date.innerHTML = `${data.time.m} / ${data.time.d} / ${data.time.yr}`;
  let product = document.createElement("h3"); product.innerHTML = data.title;
  let category = document.createElement("p"); category.innerHTML = data.type; category.className = "category";
  let desc = document.createElement("p"); desc.innerHTML = data.desc; desc.className = "descV";

  allPosts.insertBefore(post,allPosts.firstElementChild);
  
  post.appendChild(pic);
  post.appendChild(text);

  text.appendChild(head);
  text.appendChild(document.createElement("hr"));
  text.appendChild(product)
  text.appendChild(category);
  text.appendChild(desc);

  head.appendChild(user);
  head.appendChild(date);

  let like = document.createElement("img"); like.src = "assets/like.png"; like.className = "icons like";
  let comment = document.createElement("img"); comment.src = "assets/comment.png"; comment.className = "icons comment";
  let donate = document.createElement("img"); donate.src = "assets/money.png"; donate.className = "icons donate";
  let space = document.createElement("br"); space.className = "space";

  head.appendChild(space);
  head.appendChild(like);
  head.appendChild(comment);
  head.appendChild(donate);
}
function displayMyPosts(rowData) {
  let data = rowData.val();
  console.log(username);
  if(data.user == username) {
    let post = document.createElement("div"); post.className = "post actualPost";
    
    let pic = document.createElement("img"); pic.src = data.img; pic.className = "pic img"; 
    
    let text = document.createElement("div"); text.className = "info";
    
    let head = document.createElement("div"); head.className = "head";
    let user = document.createElement("h4"); user.innerHTML = '@' + data.user;
    let date = document.createElement("p"); date.innerHTML = `${data.time.m} / ${data.time.d} / ${data.time.yr}`;
    
    let del = document.createElement("button"); del.className = "delete";
    let x = document.createElement("img"); x.src = "assets/closed.png"; x.className = "trash";
    del.appendChild(x);

    del.onclick = function() {
      posts.child(rowData.key).remove();
      post.remove();
      document.getElementById(rowData.key).remove();
    }
    
    let product = document.createElement("h3"); product.innerHTML = data.title;
    let category = document.createElement("p"); category.innerHTML = data.type; category.className = "category";
    let desc = document.createElement("p"); desc.innerHTML = data.desc; desc.className = "descV";
  
    myPosts.insertBefore(post,myPosts.firstElementChild);
    
    post.appendChild(pic);
    post.appendChild(text);
  
    text.appendChild(head);
    text.appendChild(document.createElement("hr"));
    text.appendChild(product)
    text.appendChild(category);
    text.appendChild(desc);
  
    head.appendChild(user);
    head.appendChild(date);
    head.appendChild(del);
  }
  
}