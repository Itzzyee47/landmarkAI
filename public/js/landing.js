async function signUp(email, password) {
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log('User signed up:', data);
    endLoading();
    sessionStorage.setItem('user', data.email);
    goto('/chat')
  } else {
    alert('Error signing up:', data.error);
  }
}

async function signIn(email, password) {
  const response = await fetch('/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log('User signed in');
    endLoading();
    sessionStorage.clear();
    console.log(data.user.email);
    sessionStorage.setItem('user-email', data.user.email);
    sessionStorage.setItem('Uuid', data.user.uid);
    goto('/chat');
    
  } else {
    console.error('Error signing in:', data.error);
  }
}

async function sendPasswordResetEmail(email) {
  const response = await fetch('/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email}),
  });
  const data = await response.json();
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

function resetPassword(event){
  event.preventDefault();
  const email = document.getElementById('Lemail').value;

  if (email){
      startLoading();
      const reset = sendPasswordResetEmail(email);
      if(reset){
        // Password reset email sent successfully
        endLoading();
        alert('Password reset email sent. Check your inbox.');

      }else{
        endLoading();
        alert(`Failed to send password reset email: ${errorMessage}`);
     
      }

  }else{
      alert(`Please enter your email to send reset link!`);
      }
            
}

document.getElementById('signUp').addEventListener('submit', (event) => {
  event.preventDefault();
  let email = document.getElementById('Semail').value;
  let pass = document.getElementById('Sp1').value;
  let cPass = document.getElementById('Sp2').value;
  startLoading();

  if(pass == cPass){

    try {
      signUp(email, pass);
    } catch (error) {
      endLoading();
      alert(`An error occured: ${error}`);
    }
    email,pass,cPass = "";
    endLoading();
  }
  
});

document.getElementById('signIn').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('Lemail').value;
  const password = document.getElementById('Lpas').value;
  startLoading();

  try {
      signIn(email, password);
      
    } catch (error) {
      alert(`An error occured: ${error}`);
      endLoading();
    }

});



function startLoading(){
  var modal3 = document.getElementById('id03');
  modal3.style.display = "flex";
}
function endLoading(){
  var modal3 = document.getElementById('id03');
  modal3.style.display = "none";
}

function goto(site){
    window.location.assign(site);
}

// Get the modal
var modal = document.getElementById('id01');
var modal2 = document.getElementById('id02');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal || event.target == modal2) {
    modal.style.display = "none";
    modal2.style.display = "none";

  }
}

function showlog(){
    modal2.style.display = "none";
    modal.style.display = "flex";
}
function showP() {
    var x = document.getElementById("Sp1");
    var y = document.getElementById("Sp2");
    if (x.type === "password") {
      x.type = "text";
      y.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
    }
  }

  function showP2() {
    var y = document.getElementById("Lpas");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  }

  /* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

let sect1 = document.getElementById('landing');
let sect2 = document.getElementById('about');
let sect3 = document.getElementById('help');

const sections = [sect1,sect2,sect3];

function showSect(num){
    //console.log(num)
    //sections[num].style.display = "flex";
    //console.log(sections.length);
    for(i=0;i<sections.length;i++){
        if(i == num){
            sections[i].style.display = "flex";
        }else if(i != num){
            sections[i].style.display = "none";
        }
    }
    closeNav();
}
showSect(0);


// Get all nav buttons with class="p" inside the container
var btns = document.getElementsByClassName("p");

// Loop through the buttons and add the active class to the current/clicked button
for (var i = 0; i < btns.length; i++) {
btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
});
}