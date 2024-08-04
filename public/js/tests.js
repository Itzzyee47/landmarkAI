
let userMessage = "Hello there"

try {
    fetch('https://genzylla.onrender.com/getResponds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'message=' + encodeURIComponent(userMessage)
      })
      .then(response => response.json())
      .then(data => {
        const modelResponse = data.answer;
        console.log(userMessage, modelResponse);
    })
} catch (error) {
    console.log(error);
}