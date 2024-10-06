const manageConvos = document.getElementById('mConvos');
var currentUser = '';
currentUser = sessionStorage.getItem('user-email');
var modal = document.getElementById('id01');
var modal2 = document.getElementById('id02');
var modal3 = document.getElementById('id03');
var modal4 = document.getElementById('id04');
var userEmail = document.getElementById('userEmail');
var firstName = document.getElementById('firstName');
var lastName = document.getElementById('lastName');
var propic = document.getElementById('user-picture');
var fName = document.getElementById('UFN');
var lName = document.getElementById('ULN');
firstName.textContent =  'Not set';
lastName.textContent = 'Not set';
  

// Setting user details based on signed in user...
console.log(userEmail, firstName, lastName);
function getUserData() {
    
    fetch('/getUserData',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //JSON.stringify({ email, password })
      body: '',
    })
    .then(response => response.json())
    .then(data => {
          
      // User is signed in.
      const email = data.email;
      const displayName = data.displayName;
      const photoURL = data.photoURL;
      //console.log(user);

      userEmail.textContent = email;
      
      if(displayName){
        // Assuming the first name is the first part of the display name
        firstName.textContent = displayName ? displayName.split(' ')[0] :'Not set';
        fName.value = displayName ? displayName.split(' ')[0] :'';
        lastName.textContent = displayName ? displayName.split(' ')[1] : 'Not set';
        lName.value = displayName ? displayName.split(' ')[1] : '';
      }
      
      if(photoURL){
          document.getElementById('user-picture').src = photoURL;
      }
      
    });
                 
  }
  
getUserData();

const form = document.getElementById('updateImgForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    startLoading();
    const fileInput = document.getElementById('imgFile');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('profilePic', file);
        
        console.log('Sending img to server')
        try {
            const response = await fetch('/updateUPicture', {
                method: 'POST',
                body: formData,
            });
            //console.log(response);
            
            if (response.ok) {
                const data = await response.json();
                document.getElementById('user-picture').src = data.pic;
                endLoading();
                alert('File uploaded successfully!!');
                closeModal();
              } else {
                console.error('Failed to upload file:', await response.json());
              }

        } catch (error) {
            alert('Error uploading file:', error);
        }
    } else {
        alert('No file provided.');
    }

})


async function updateUdetails(event) {
    event.preventDefault();
    closeModal();
    const firstName = document.getElementById('UFN').value;
    const lastName = document.getElementById('ULN').value;

    startLoading();
    fetch('/updateUserName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //JSON.stringify({ email, password })
        body: JSON.stringify({ firstName, lastName }),
    })
    .then(response => response.json())
    .then(data =>{
        alert(data.message);
        getUserData();
        endLoading();
        window.location.reload();
    })
}


async function getConvos(){  

  try {
    console.log('Preping to get convos for', currentUser);
    const response = await fetch('/getConvo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //JSON.stringify({ email, password })
        body: JSON.stringify({ currentUser }),
      });
    var data = await response.json();
    const querySnapshot = data.respons;
    //console.log(data.respons);

      try {
        querySnapshot.forEach((doc) => {
          // Display each document's data
          const t = doc.date;
          const id = doc.id;
          const date = new Date(Number(t));//convert string date to actual date format
          let options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
          var D = date.toLocaleDateString('en-US', options);
          let elm = `
              <div class="convoData" title='${id}'>${D}</div>
              <div class="convoActions">
                  <div class="edit">&#128221;</div>
                  <div class="delete" onclick="deleteConvo('${id}') ">&#10060;</div>
              </div>
          `;
          let passChat = document.createElement("li");
          
          passChat.innerHTML = elm;
          manageConvos.appendChild(passChat);
          //console.log(id);
          console.log(passChat);
        });

        // Load the messages of the latest conversation
       

      } catch (error) {
        console.log(`There was an error loading the messages: ${error}`);
        alert(`There was an error loading the messages: ${error}`);
      }
      
  
  } catch (error) {
    
      console.error("Error reading document: ", error);
  }
    
}

async function deleteConvo(id) {
  try {
    const response = await fetch('/deleteConvo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //JSON.stringify({ email, password })
      body: JSON.stringify({ id }),
    });

    var data = await response.json();
    if( response.ok){
      closeModal();
      alert(data.message);
      location.reload();
    }
  
  } catch (error) {
    alert(error);
  }
}


getConvos();
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2 || event.target == modal3 || event.target == modal4) {
    closeModal();
    }
}

function closeModal(){
    modal.style.display = "none";
    modal2.style.display = "none";
    modal3.style.display = "none";
    modal4.style.display = "none";
}
function startLoading(){
    var modal3 = document.getElementById('id04');
    modal3.style.display = "flex";
  }
  function endLoading(){
    var modal3 = document.getElementById('id04');
    modal3.style.display = "none";
  }

function goBack() {
    window.history.back()
    }
