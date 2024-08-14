require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL } =  require('firebase/storage');
const { getFirestore,collection, deleteDoc, doc, addDoc, where,getDocs, query, orderBy, } = require('firebase/firestore');

//const {getRespons} = require('./public/js/model')
const path = require('path');
const app = express();
const port = 4000;

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "lsachatbot.firebaseapp.com",
    projectId: "lsachatbot",
    storageBucket: "lsachatbot.appspot.com",
    messagingSenderId: "817674467330",
    appId: "1:817674467330:web:a97a4b92bc7a8258308f1b"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
    auth.onAuthStateChanged(user => {
        if (!user) {
            
            return res.redirect('/?message=Please+login+or+signup'); 
        }else{
            next();
        }
    });
}

function timeStamp() {
    var d = new Date();
    var n = d.getTime();
    return n;
  }


// Serve HTML profilePic
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

// Signup users.
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log('User created!!');
        res.send({user});
    })
    .catch((error) => {
        res.send({error: `An error occured: ${error}` });
    });
});

// SignIn users.
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log("Attempting to signin",email);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
       
        console.log('User logged-in!!');
        res.send(({user}));
        
    })
    .catch((error) => {
        res.send({error: `An error occured: ${error}` });
    });
});


app.post('/resetPassword', async (req, res) => {
    const email = req.body;

    sendPasswordResetEmail(auth, email)
    .then(()=>{
        res.send({status: "Reset link sent" });
    })
    .catch((error)=>{
        res.send({error: `An error occured: ${error}` });
    })
});


app.post('/getUserData', (req, res) => {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            const email = user.email;
            const displayName = user.displayName;
            const photoURL = user.photoURL;

            res.send({email,displayName,photoURL});
        }
    });
});

app.post('/saveMessage', async (req, res) => {
    const { u, message,convoID } = req.body;
    try {
        if(u == 'bot'){
          await addDoc(collection(db, 'messages'), {
            sender: 'bot',content: message,convoId: convoID, time: `${timeStamp()}`
          });
          res.status(200);
        }else{
          await addDoc(collection(db, 'messages'), {
            sender: u, content: message, convoId: convoID, time: `${timeStamp()}`
          });
          res.status(200);
        }
        
      } catch (e) {
        console.error('Error saving document ', e);
      }
})

app.post('/getMessage', async (req, res) => {
    const { convoID } = req.body;
    
    try {
        let respons = [];
        var snapshot = await getDocs(query(collection(db, 'messages'),where("convoId", "==", convoID),orderBy("time", "asc")));
        const result = snapshot.forEach((doc) => {
            // Display each document's data
            const data = doc.data();
            const sender = data.sender;
            const content = data.content;
            respons.push({sender,content});
        });
        
        res.send({snapshot:respons});        
    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting messages: ', error);
    }
})

app.post('/createConvo', async (req, res) =>{
    const time = timeStamp();
    const {currentUser} = req.body;
    try {
        const addToDb = await addDoc(collection(db, "conversations"), {
            user: currentUser,
            time: `${time}`
        });
      
        res.send({snapshot:addToDb.id});
    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting messages ', error);
    }

})

app.post('/sendFeedback', async (req, res) =>{
    const time = timeStamp();
    const {currentUser, feedback} = req.body;
    try {
        const addToDb = await addDoc(collection(db, "feedbacks"), {
            user: currentUser,
            feedback: feedback,
            time: `${time}`
        });
      
        res.send({message:'Feedback sucessfully sent!'});
    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error sending feedback ', error);
    }

})

app.post('/getConvo', async (req, res) =>{
    
    const {currentUser} = req.body;
    try {
        let respons = [];
        const snapshot = await getDocs(query(collection(db, "conversations"),where("user", "==", currentUser)));
        const result = snapshot.forEach((doc) => {
            // Display each document's data
            const data = doc.data();
            const id = doc.id;
            const date = data.time
            respons.push({id,date});
        });
       
        res.send({ respons:respons});

    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting conversations ', error);
    }

})

app.get('/chat', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'chatpage.html'));
});

app.get('/manageProfile', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'manageProfile.html'));
});

app.post('/updateUserName', (req, res) => {
    const {firstName, lastName} = req.body;
    const user = auth.currentUser;
    const newDisplayName = `${firstName} ${lastName}`;
    try {
        if (user) {
            // Update the user's display name
            updateProfile(user, {
              displayName: newDisplayName,
            });
        }
        res.status(202).send({message:'User name updated!! May take a few seconds to take effect.'});
    } catch (error) {
        res.status(302).send({ error });
    }
});
 
app.post('/updateUPicture', upload.single('profilePic'), async (req, res) => {
    const profilePic = req.file;
    const userId = auth.currentUser.uid; 
    try {
        // Define the storage path for the user's profile picture
        const storageRef = ref(storage, `profilePictures/${userId}/${profilePic.name}`);
    
        // Upload the profilePic to Firebase Storage
        const snapshot = await uploadBytes(storageRef, profilePic.buffer);
    
        if(snapshot){
            // Get the download URL of the uploaded profilePic
            const downloadURL = await getDownloadURL(storageRef);
            // Update the user's profile in Firebase Authentication
            await updateProfile(auth.currentUser, {
            photoURL: downloadURL,
            });

            res.status(200).send({pic:downloadURL});
        }
    } catch (error) {
        console.log(error);
        res.status(301).send({ error });
    }
})

app.post('/deleteConvo', async (req, res) => {
    const { id } = req.body;
  
    try {
      // Reference to the messages collection and query for messages with the conversation ID
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('convoID', '==', id));
      const querySnapshot = await getDocs(q);
  
      // Delete all messages belonging to the conversation
      const deletePromises = [];
      querySnapshot.forEach((messageDoc) => {
        deletePromises.push(deleteDoc(messageDoc.ref));
      });
      await Promise.all(deletePromises);

      // Reference to the conversation document
      const convoRef = doc(db, 'conversations', id);
      // Delete the conversation document
      await deleteDoc(convoRef);
  
      // Respond with success
      res.status(200).send({message:'Conversation and its messages deleted successfully'});

    } catch (error) {
      console.error('Error deleting conversation or messages: ', error);
      res.status(500).send('An error occurred while deleting the conversation and its messages');
    }
  });

app.get('/logout', function(req , res){
    signOut(auth).then(() => {
        console.log("user loged out")
        sessionStorage.clear();
        res.status(200);   
    }).catch((error) => {
        res.send({error: `An error occured: ${error}` });
    });
});



app.listen(port, () => {
    
    console.log(`Server is running at http://localhost:${port}`);
});
