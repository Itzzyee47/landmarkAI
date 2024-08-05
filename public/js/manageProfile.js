var modal = document.getElementById('id01');
var modal2 = document.getElementById('id02');
var modal3 = document.getElementById('id03');
var userEmail = document.getElementById('userEmail');
var firstName = document.getElementById('firstName');
var lastName = document.getElementById('lastName');
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
        lastName.textContent = displayName ? displayName.split(' ')[1] : 'Not set';
      }
      
      if(photoURL){
          document.getElementById('user-picture').src = photoURL;
      }
      
    });
                 
  }
  
getUserData();

async function updateImage(event){
    event.preventDefault();

    const fileInput = document.getElementById('imgFile');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('profilePic', file);

        try {
        const response = await fetch('/updateUPicture', {
            method: 'POST',
            body: formData,
        });

            if (response.ok) {
                alert('Profile picture updated sucessfully!!');
                location.reload();
            } else {
                console.error('Failed to update profile picture');
            }
        } catch (error) {
        console.error('Error uploading file:', error);
        }
    } else {
        alert('No file provided.');
    }

}


async function updateUdetails(event) {
    event.preventDefault();

    const firstName = document.getElementById('UFN').value;
    const lastName = document.getElementById('ULN').value;


    fetch('/updateUserName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //JSON.stringify({ email, password })
        body: JSON.stringify({ firstName, lastName }),
    }).then(response => response.json())
    .then(data =>{
        alert(data);
    })
}















// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2 || event.target == modal3) {
    modal.style.display = "none";
    modal2.style.display = "none";
    modal3.style.display = "none";
    }
}

function goBack() {
    window.history.back()
    }
