//import hljs from "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js";
import hljs from 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js';

function signOutUser(){
  const response = fetch('/logout', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    //JSON.stringify({ email, password })
    
  });

}
// Make the function globally accessible
window.signOutUser = signOutUser;



async function getUserData() {
    
  const response = await fetch('/getUserData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    //JSON.stringify({ email, password })
    body: '',
  });
  const user = await response.json();
        
    // User is signed in.
    const email = user.email;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    //console.log(user);
    // Make the user globally accessible
    document.getElementById('currentUser').textContent = email;

    // Display user data
    document.getElementById('user-email').textContent = email;
    if(displayName){
      // Assuming the first name is the first part of the display name
      const firstName = displayName ? displayName.split(' ')[0] : '';
      document.getElementById('userName').textContent = `Hi, ${firstName}`;
    }else{
      // Assuming there is no display name use email as name
      const firstName = email ? email.split('@')[0] : '';
      document.getElementById('userName').textContent = `Hi, ${firstName}`;
    }
    
    if(photoURL){
        document.getElementById('user-picture').src = photoURL;
    }
            
        
    
}
getUserData();
//Updated typewriter function....
function applyTypewriterEffect(markdownContent, element) {
  // Convert the Markdown content to HTML
  const renderedHtml = marked(markdownContent);
  // Get the typewriter target element
  const typewriterTarget = element;

  // Clear any existing content in the typewriter target
  typewriterTarget.innerHTML = '';

  // Initialize the TypewriterJS effect
  const typewriter = new Typewriter(typewriterTarget, {
      loop: false,
      delay: 8,
      cursor: '',
  });
  let scrol = true;
  // Function to scroll to the bottom
  async function continuousScroll() {
      while (scrol) {
          chatHistory.scrollTop = chatHistory.scrollHeight;
          await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the delay as needed
      }
  }

  // Start the continuous scroll function
  const scrollPromise = continuousScroll();

  typewriter
      .typeString(renderedHtml)
      .callFunction(() => {
          // Optionally apply syntax highlighting after typing
          document.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightElement(block);
          });
      })
      .start()
      .callFunction(() => {
          // Stop continuous scrolling when typing is complete
          scrollPromise.then(() => clearInterval(scrollPromise));
          scrol = false;
      });

      hljs.highlightAll();

  marked.setOptions({
      mangle: false,
      headerIds: false
  });
}


const chatHistory = document.getElementById('chat-history');
const userMessageInput = document.getElementById('user-message');
const sendMessageButton = document.getElementById('send-button');
const loader = document.getElementById('loader');
let Convo = document.getElementById('Convo');
console.log(Convo.attributes[2].textContent, timeStamp());
let currentCovoID = Convo.attributes[2].textContent;  // Current conversations ID...

let isLoading = false;

function timeStamp() {
  var d = new Date();
  var n = d.getTime();
  return n;
}

function isMarkdown(text) {
  // Regular expressions for different Markdown elements
  const markdownPatterns = [
    /^#{1,6}\s/, // Headers (e.g., # Header, ## Header)
    /\*\*.*\*\*/, // Bold (e.g., **bold**)
    /\*.*\*/, // Italics (e.g., *italic*)
    /\[.*\]\(.*\)/, // Links (e.g., [link](http://example.com))
    /!\[.*\]\(.*\)/, // Images (e.g., ![alt text](image.jpg))
    /^>\s/, // Blockquotes (e.g., > quote)
    /^(\*|\-|\+)\s/, // Unordered lists (e.g., * item, - item, + item)
    /^\d+\.\s/, // Ordered lists (e.g., 1. item, 2. item)
    /```[\s\S]*```/, // Code blocks (e.g., ```code```)
    /`.*`/, // Inline code (e.g., `code`)
    /^-{3,}$/, // Horizontal rule (e.g., ---)
  ];

  // Check if any pattern matches the text
  return markdownPatterns.some(pattern => pattern.test(text));
}

async function saveChatMessage(message,u) {
  try {
    let convoID = Convo.attributes[2].textContent;
    const response = await fetch('/saveMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //JSON.stringify({ email, password })
      body: JSON.stringify({ u, message, convoID }),
    });
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
  } catch (e) {
    console.error('Error saving document: ', e);
  }
}



document.getElementById('message-form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log('subimited');

  if (chatHistory.children.length >= 1) {
    document.getElementById('p1').style.display = "none";
  }

  const userMessage = userMessageInput.value;
  if (!userMessage) {
    return;
  }
  userMessageInput.value = ""; // Clear user input after sending
  loader.style.display = "block";

  // Add user message to chat history
  const userMessageElement = document.createElement('div');
  userMessageElement.classList.add('chat-message', 'user-message');
  userMessageElement.innerHTML = `<div class="message-content" data='${timeStamp()}'>${userMessage}</div>`;
  chatHistory.appendChild(userMessageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom

  saveChatMessage(userMessage,currentUser); // Save user message to database.

  // Model response holder
  const modelMessageElement = document.createElement('div');

  function addModelMessageElement() {
    // Add model response to chat history
    modelMessageElement.classList.add('chat-message', 'model-message');
    modelMessageElement.innerHTML = `<div class="message-content ai-message" data='${timeStamp()}'></div>`;
    chatHistory.appendChild(modelMessageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
  }

  // Asynchronous request sent to backend
  try {
    loader.style.display = "block";

    if (navigator.onLine) {
      fetch('https://genzylla.onrender.com/getResponds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'message=' + encodeURIComponent(userMessage)
      })
      .then(response => response.json())
      .then(data => {
        const modelResponse = data.answer;
        addModelMessageElement();
        const messageContentElement = modelMessageElement.querySelector('.message-content');
        saveChatMessage(modelResponse,"bot"); // Save user message with HTML
        applyTypewriterEffect(modelResponse, messageContentElement); // Typewriter effect for HTML
        setTimeout(() => {
          loader.style.display = "none";
          chatHistory.scrollTop = chatHistory.scrollHeight;
          
        }, 4000);
        
      })
      .catch((error) => {
        console.log('Error fetching response:', error);
      });
    }
  } catch (err) {
    const modelResponse = "An error occurred while trying to get a response. Please check your internet connectivity.";
    typeWriter(modelResponse, modelMessageElement.querySelector('.message-content'));
    loader.style.display = "none";
  }

  
});


let chats = document.getElementById('allConvos');
let chatsMobile = document.getElementById('allConvosMobile');

// Test case to get all conversations from the database belonging to the current user.

let currentUser = document.getElementById('currentUser').textContent;

function createMessageBubble(sender,message){
  // Add user message to chat history
  const MessageElement = document.createElement('div'); 
  MessageElement.classList.add('chat-message');
  if(sender == currentUser){
    MessageElement.classList.add('user-message');
    MessageElement.innerHTML = `<div class="message-content" data='${timeStamp()}'>${message}</div>`;
  }else{
    MessageElement.classList.add('model-message');
    if(isMarkdown(message)){
      MessageElement.innerHTML = `<div class="message-content ai-message" data='${timeStamp()}'>${marked(message)}</div>`;
    }else{
      MessageElement.innerHTML = `<div class="message-content ai-message" data='${timeStamp()}'>${message}</div>`;
    }
    
  }
  
  chatHistory.appendChild(MessageElement);
  setTimeout(() => {
    chatHistory.scrollTop = chatHistory.scrollHeight;
   
  }, 2000);
}

async function loadMessages(id) {
  //const q = query(collection(db, 'messages'),where("convoId", "==", id));
  if (!id) {
    console.error("Invalid conversation ID: ", id);
    return;
  }
  const convoID = id;
  console.log('convoid:',convoID);
    const response = await fetch('/getMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //JSON.stringify({ email, password })
      body: JSON.stringify({ convoID }),
    });
  var data = await response.json();
  console.log(data);
  const querySnapshot = data.snapshot;
  if (!querySnapshot){

    chatHistory.innerHTML = " "; //clear the chat history

  }else{
    querySnapshot.forEach((dox) => {
      // create message bubble...
      console.log(dox);
      const sender = dox.sender;
      const message = dox.content;
      const time = dox.time;
      createMessageBubble(sender, message);
    });
    hljs.highlightAll();
  }
  if (chatHistory.children.length >= 1) {
    document.getElementById('p1').style.display = "none";
  }
  chatHistory.scrollTop = chatHistory.scrollHeight;
}


//localStorage.clear();
async function createNewCOnversation(){
  
  const response = await fetch('/createConvo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //JSON.stringify({ email, password })
      body: JSON.stringify({ currentUser }),
    });
  var data = await response.json();
  const querySnapshot = data.snapshot;
  const doc = querySnapshot[0];
  console.log(doc);
  // Setting the current conversations id to the newly created conversation... 
  Convo.attributes[2].textContent = doc.id;
  chatHistory.innerHTML = ""; //Clear chathistory to start new conversation..
}

async function loadConvo(id){
  console.log(id);
  try {
    chatHistory.innerHTML = ""; //Clear chathistory ..
    // Setting the current conversations id to the newly created conversation... 
    Convo.attributes[2].textContent = id;
    
    loadMessages(id);

  } catch (error) {
    console.log(`There was an error loading: ${error}`);
  }
}

async function getConvos(){  
  try {
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

    if (querySnapshot.length != 0) {
      //load all conversations in recent convo list...
      try {
        querySnapshot.forEach((doc) => {
          // Display each document's data
          const t = doc.date;
          const id = doc.id;
          let passChat = document.createElement("li");
          passChat.classList.add("hiddenTxt"); 
          passChat.classList.add("convo");
          passChat.addEventListener('click', ()=>{loadConvo(doc.id);});
          passChat.title = id;
          passChat.id = id;
          console.log(t);
          const date = new Date(Number(t));//convert string date to actual date format
          console.log(t, id);
          passChat.innerText = date;
          chats.appendChild(passChat);
          //console.log(id);
          console.log(JSON.stringify(data));
        });

        // Load the messages of the latest conversation
        const latestDoc = querySnapshot[0];
        console.log(latestDoc.id);
        //load messages blonging to conversation of id....
        Convo.attributes[2].textContent = latestDoc.id;
        loadMessages(latestDoc.id);
        console.log(latestDoc.id);

      } catch (error) {
        console.log(`There was an error loading the messages: ${error}`);
        alert(`There was an error loading the messages: ${error}`);
      }
      
    }else {
       // No conversations found, create a new one
       createNewCOnversation();
       location.reload();
    
    }

  } catch (error) {
    
      console.error("Error reading document: ", error);
  }
    
}

async function getConvosMview(){  
  try {
    
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

    if (!querySnapshot.empty) {
      //load all conversations in recent convo list...
      try {
        querySnapshot.forEach((doc) => {
          // Display each document's data
          const t = doc.date;
          const id = doc.id;
          let passChat = document.createElement("li");
          passChat.classList.add("hiddenTxt"); 
          passChat.classList.add("convo");
          passChat.addEventListener('click', ()=>{loadConvo(doc.id);});
          passChat.title = id;
          passChat.id = id;
          //console.log(t);
          const date = new Date(Number(t));//convert string date to actual date format
          //console.log(t, id);
          passChat.innerText = date;
          chatsMobile.appendChild(passChat);
          //console.log(id);
          console.log(JSON.stringify(data));
        });
    } catch (error) {
      console.log(`There was an error loading the messages: ${error}`);
      alert(`There was an error loading the messages: ${error}`);
    }
      
    }

  } catch (error) {
    
      console.error("Error reading document: ", error);
  }
    
}


let newConvoBtn = document.getElementById('cNconvo');
let newConvoBtn2 = document.getElementById('cNconvo2');
newConvoBtn.addEventListener('click', () => {createNewCOnversation();});
newConvoBtn2.addEventListener('click', () => {createNewCOnversation();});

getConvos();
getConvosMview();
getUserData();
console.log('DOne');
hljs.highlightAll();