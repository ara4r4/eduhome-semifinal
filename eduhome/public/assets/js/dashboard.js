
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
async function getRole(cookie){
    if(!cookie) return alert("NO COOKIE PROVIDED");
    
    const response = await fetch('/get-role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secret: secret, cookie: cookie })
    });
    
    const data = await response.json();
    const username = data.role;
    
    return username || null;
}

async function verified(cookie){
    if(!cookie) return alert("NO COOKIE PROVIDED")

    const response = await fetch("/verified-or-not", {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({ secret: secret, cookie, cookie})
    });

    const data = await response.json()
    const trueorvalse = data.trueorfalse
    if(trueorvalse == false){
        lockdown()
    }

    
}

const cookie = getCookie("EDUHOME-COOKIE")
   
    
    if (cookie) {
        function getFirstPath() {
            const path = window.location.pathname;
            const parts = path.split('/');
            if (parts.length > 1) {
                return '/' + parts[1];
            } else {
                return path;
            }
        }
       async function e(){
        const role = await getRole(cookie)
        if(role == "admin" || role=="staff"){
            const i11 = getFirstPath()
            if(i11 !== "/admin") {
            window.location.href = "../admin/home.html"
        }else{

        }
        }else if(role == "teacher"){
            const i11 = getFirstPath()
        
            if(i11 !== "/dashboard") window.location.href = "../dashboard/home.html"
            else{

            }
        }else{
            window.location.href = "../students/main.html"
        }
       }
       e()
        verified(cookie)
        
        fetch('/get-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ secret: secret, cookie: cookie })
        })
        .then(response => response.json())
        .then(data => {
            const username = data.username;
     
            if (username) {
  
                (document.getElementById("username")).textContent = username
            }else{
              
            window.location.href = "../login.html"
            }
        });
    }else{
        window.location.href = "../index.html"
            }
            







function logout(){
    // Delete the cookie
    document.cookie = "EDUHOME-COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  
    
    window.location.href = "../login.html";
}

function lockdown(){
    window.location.href = "../verify.html"
}