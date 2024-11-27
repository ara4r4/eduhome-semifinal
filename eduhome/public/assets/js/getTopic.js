const secret = `>#jc=Wer6WkmN9vb<Ue1(363($Griz`
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