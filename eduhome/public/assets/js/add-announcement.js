document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    fetch('/get-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret: secret, cookie: cookie })
    })
    .then(response => response.json())
    .then(async data =>{
        const username = data.username;
    
    // Get form values
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    if(content.length >= 751){
        alert("Data cannot be more than 750 characters")
    }

    // Call saveQuestion function
    const sender = username
   
    await saveQuestion(title, content, sender);
});

});
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
async function getTopic(cookie){
    if(!cookie) return alert("NO COOKIE PROVIDED");
    
    const response = await fetch('/get-topic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret: secret, cookie: cookie })
    });
    
    const data = await response.json();
    const username = data.teachingTopic;
  
    return username || null;
}
async function saveQuestion(title, content, sender) {
    const cookie = getCookie('EDUHOME-COOKIE');
    const topic = await getTopic(cookie)
    
    
    fetch('/add-announcement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret, title, content, topic, sender })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Successfully saved");
            window.location.reload();
        } else {
            alert(`${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
