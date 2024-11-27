document.getElementById('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    var question = document.getElementById('question').value;
    var trueAnswer = document.getElementById('answer').value;
    var answerA = document.getElementById('answerA').value;
    var answerB = document.getElementById('answerB').value;
    var answerC = document.getElementById('answerC').value;
    var answerD = document.getElementById('answerD').value;
    var unit = document.getElementById("unit").value;
    // Call saveQuestion function
    await saveQuestion(question, trueAnswer, answerA, answerB, answerC, answerD, unit);
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
async function saveQuestion(question, trueAnswer, answerA, answerB, answerC, answerD, unit) {
    const cookie = getCookie('EDUHOME-COOKIE');
    const topic = await getTopic(cookie)
    
    
    fetch('/add-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret, question, trueAnswer, answerA, answerB, answerC, answerD, topic, unit })
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
