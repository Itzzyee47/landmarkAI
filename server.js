require('dotenv').config();
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } = require('firebase/auth');
const { getFirestore,collection, addDoc, where,getDocs, query, orderBy, } = require('firebase/firestore');

//const {getRespons} = require('./public/js/model')
const path = require('path');
const app = express();
const port = 4000;

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


// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

// Signup users.
app.get('/signup', async (req, res) => {
    const { email, password } = req.body;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        res.send({user: user.email, uid: user.uid });
        console.log('User created!!');
    })
    .catch((error) => {
        res.send({error: `An error occured: ${error}` });
    });
});

// SignIn users.
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log("Attempting to signin",email, password);
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        res.send({user: user.email, uid: user.uid });
        console.log('User logged-in!!');
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
    const { u, message,convoId } = req.body;
    try {
        if(u == 'bot'){
          await addDoc(collection(db, 'messages'), {
            sender: 'bot',content: message,convoId,time: `${timeStamp()}`
          });
          res.status(200);
        }else{
          await addDoc(collection(db, 'messages'), {
            sender: u,content: message,convoId: convoId,time: `${timeStamp()}`
          });
          res.status(200);
        }
        
      } catch (e) {
        console.error('Error saving document ', e);
      }
})

app.post('/getMessage', async (req, res) => {
    const { convoId } = req.body;

    try {
        var snapshot = await getDocs(query(collection(db, 'messages'),where("convoId", "==", convoId),orderBy("time", "asc")));
        res.send({snapshot});        
    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting messages ', e);
    }
})

app.post('/createConvo', async (req, res) =>{
    const time = timeStamp();
    const {currentUser} = req.body;
    try {
        await addDoc(collection(db, "conversations"), {
            user: currentUser,
            time: `${time}`
        });
      
        const snapshot = await getDocs(query(collection(db, "conversations"),where("time", "==", time), limit(1)));
        res.send({snapshot});
    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting messages ', e);
    }

})

app.post('/getConvo', async (req, res) =>{
    const time = timeStamp();
    const {currentUser} = req.body;
    try {
        const snapshot = await getDocs(query(collection(db, "conversations"),where("user", "==", currentUser)));
        res.send({snapshot});

    } catch (error) {
        res.send({error: `An error occured: ${error}` });
        console.error('Error getting conversations ', e);
    }

})

app.get('/logout', function(req , res){
    signOut(auth).then(() => {
        console.log("user loged out")
        res.redirect('/');     
    }).catch((error) => {
        res.send({error: `An error occured: ${error}` });
    });
});

app.get('/chat', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views', 'chatpage.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
