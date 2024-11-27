// Include this script in your HTML file
const secret1 = `>#jc=Wer6WkmN9vb<Ue1(363($Griz`
async function createSecretKey() {
    try {
        const response = await fetch('/generateSecretKey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secret: secret1, cookie: cookie })
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            alert(errorMessage.error);
            return;
        }

        const secretData = await response.json();
        return secretData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function createQRCode(secret) {
    const otpAuthUrl = `otpauth://totp/MyApp:${secret.username}?secret=${secret.secret}&issuer=MyApp`;
    const qrCodeImageUrl = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${otpAuthUrl}`;
    document.getElementById('qrcode').src = qrCodeImageUrl;
}

async function createUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    if (username.length == 15 || username.length > 14) return alert("Username cannot be more than 14 letters");

    try {
        const secret = await createSecretKey();
        if (secret) {
            await createUserToDatabase(username, password, email, "user", "none", secret.secret);
            console.log('User created');
            createQRCode(secret);
        }
    } catch (error) {
        alert(error.error); // Display the error message in an alert
    }
}

async function createUserToDatabase(username, password, email, role, teachingTopic, secret) {
    const userData = {
        username,
        password,
        email,
        role,
        teachingTopic,
        secret, // Add the secret to the user data
    };

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(secret1, userData),
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            alert(errorMessage.error);
            return;
        }

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const responseData = await response.json();
            return responseData;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Assuming you have an HTML element with id="qrcode" for displaying the QR code
