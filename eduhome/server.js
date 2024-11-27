const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs")
const app = express();
const path = require("path")
const db = require("./db/mainDb")
const cookieParser = require('cookie-parser');
const speakeasy = require('speakeasy');
const nodemailer = require("nodemailer")
const secretInput = ">#jc=Wer6WkmN9vb<Ue1(363($Griz"
require("dotenv").config()
// Middleware
app.use(express.urlencoded({
    extended: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');

})


console.log("rannow")
app.use(express.static(path.join(__dirname, 'public')));



const crypto = require('crypto');

const session = require('express-session');

// Step 1: Send Verification Email
function sendVerificationEmail(email, verificationToken) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'arayasintaha93@gmail.com',
        pass: 'roxh pfzp vwwe ijcb'
      }
    });
  
    const mailOptions = {
      from: 'arayasintaha93@gmail.com',
      to: email,
      subject: 'Verify Your Email',
      text: `Verify your email on this link: localhost:3000/verify?token=${verificationToken}`,
      html: `
          <!DOCTYPE html>
          <html lang="en">
          
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                      text-align: center;
                  }
          
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 10px;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  }
          
                  h1 {
                      color: #333333;
                  }
          
                  p {
                      color: #555555;
                  }
          
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: hsl(0, 0%, 100%);
                      color: #333333;
                      text-decoration: none;
                      border-radius: 5px;
                      font-weight: bold;
                      margin-top: 20px;
                  }
          
                  .button:hover {
                      background-color: #333333;
                      color: hsl(0, 0%, 100%);
                  }
          
                  img {
                      max-width: 100%;
                      height: auto;
                  }
              </style>
          </head>
          
          <body>
              <div class="container">
                  <img src="public/images/eduhome.png" alt="Logo">
                  <h1>Email Verification</h1>
                 
                  <p>Thank you for signing up! Please click the button below to verify your email address.</p>
                  <a class="button" href="http://eduhome.site/verify?token=${verificationToken}">Verify Email</a>
              </div>
          </body>
          
          </html>
      `,
      
  };
  
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  app.post('/generateSecretKey', (req, res) => {
    const secret = speakeasy.generateSecret();
    res.json({
        username: req.body.username, // Assuming you send the username in the request
        secret: secret.base32,
    });
});
  // Step 2: Handle Email Verification
  app.get('/verify', (req, res) => {
    
    const token = req.query.token;
    
    const verifyEmailSql = 'UPDATE users SET email_verified = ? WHERE verification_token = ?';
    db.query(verifyEmailSql, [true, token], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.redirect('/login.html');
      }
    });
  });
  

  app.post('/signup', (req, res) => {
  
     
 
    const { username, password, email, role, teachingTopic,secret1 } = req.body;
   

    if(secret1 !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
    
    const cookie = `EDUHOME-${crypto.randomBytes(25).toString('hex')}${crypto.randomBytes(25).toString('hex')}`;
    const verificationToken = crypto.randomBytes(16).toString('hex');
  
    const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsernameSql, [username], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (result.length > 0) {
       
        res.status(400).json({ error: 'Username already taken' });
      } else {
        const checkEmailSql = `SELECT * FROM users WHERE email = ?`
        db.query(checkEmailSql, [email], (err, result) => {
          if(err){
            console.error(err)
            res.status(500).json({ error: 'Internal server error'});
            return
          }
          if(result.length > 0 ){
            res.status(400).json({ error: 'Email already used'})
          }else{

          
        const sql = 'INSERT INTO users (username, password, email, cookie, role, teachingTopic, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [username, password, email, cookie, role, teachingTopic, verificationToken], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          
         
  
          // Step 1: Send Verification Email
          sendVerificationEmail(email, verificationToken);
  
          res.cookie('EDUHOME-COOKIE', cookie);
          res.redirect('/dashboard/home.html');
        });
      }
    })
      }
    });
  });

  app.post('/create-user', (req, res) => {
    const { username, password, email, role, teachingTopic, grade, letter, secret1 } = req.body;
    const vtoken = "12345";
    let grade1 = ""
    let letter1 = ""
    if(!grade) grade1 = "none"
    else grade1 = grade;
    if(!letter) letter1 = "none"
    else letter1 = letter;


    if (secret1 !== secretInput) {
      res.json("Get away");
      return "Get away";
    }
  
    const cookie = `EDUHOME-${crypto.randomBytes(25).toString('hex')}${crypto.randomBytes(25).toString('hex')}`;
  
    const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUsernameSql, [username], (err, result1) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error1', success: false });
        return;
      }
    
      if (result1.length > 0) {
        res.status(400).json({ error: 'Username already taken', success: false });
      } else {
        const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailSql, [email], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error2', success: false });
            return;
          }
    
          if (result.length > 0) {
            res.status(400).json({ error: 'Email already taken', success: false });
            return;
          } else {
            const sql = 'INSERT INTO users (username, password, email, verification_token, email_verified, cookie, role, teachingTopic, grade, letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [username, password, email, vtoken, true, cookie, role, teachingTopic, grade1, letter1], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error', success: false });
                return;
              }
    
              console.log('User registered by hand');
              res.status(200).json({ message: 'Successfully made custom account', success: true });
            });
          }
        });
      }
    });
    
  });
  app.post('/create-class', (req, res) => {
    const { grade, letter, leader, secret1 } = req.body;

  
    if (secret1 !== secretInput) {
      res.json("Get away");
      return "Get away";
    }
  
   

            const sql = 'INSERT INTO classes (grade, letter, leader) VALUES (?, ?, ?)';
            db.query(sql, [grade, letter, leader], (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error', success: false });
                return;
              }
    

              res.status(200).json({ message: 'Successfully made custom class', success: true });
            });
       
   
    
  });
  
app.post('/get-username', (req, res) => {
   const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const cookie = req.body.cookie;
    const sql = 'SELECT username FROM users WHERE cookie = ?';
    db.query(sql, [cookie], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const username = result[0].username;
            res.json({ username });
        } else {
            res.json({ username: null });
        }
    });
});
app.post('/get-email', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const cookie = req.body.cookie;
   const sql = 'SELECT email FROM users WHERE cookie = ?';
   db.query(sql, [cookie], (err, result) => {
       if (err) throw err;

       if (result.length > 0) {
           const email = result[0].email;
           res.json({ email });
       } else {
           res.json({ email: null });
       }
   });
});
app.post('/get-role', (req, res) => {
   const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const cookie = req.body.cookie;
    const sql = 'SELECT role FROM users WHERE cookie = ?';
    db.query(sql, [cookie], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const role = result[0].role;
            res.json({ role });
        } else {
            res.json({ role: null });
        }
    });
});
app.post('/get-role-by-id', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const id = req.body.id;
   const sql = 'SELECT role FROM users WHERE id = ?';
   db.query(sql, [id], (err, result) => {
       if (err) throw err;

       if (result.length > 0) {
           const role = result[0].role;
           res.json({ role });
       } else {
           res.json({ role: null });
       }
   });
});
app.post('/get-role-by-username-or-email', (req, res) => {
  const { secret, input } = req.body;

  if (secret !== secretInput) {
      res.json("Get away");
      return "Get away";
  }

  if (!input) {
      res.json({ role: null });
      return;
  }

  const isEmail = input.includes('@');

  const identifier = isEmail ? 'email' : 'username';
  const sql = `SELECT role FROM users WHERE ${identifier} = ?`;

  db.query(sql, [input], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
          const role = result[0].role;
          res.json({ role });
      } else {
          res.json({ role: null });
      }
  });
});




app.post('/get-topic', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const cookie = req.body.cookie;
   const sql = 'SELECT teachingTopic FROM users WHERE cookie = ?';
   db.query(sql, [cookie], (err, result) => {
       if (err) throw err;

       if (result.length > 0) {
           const teachingTopic = result[0].teachingTopic;
           res.json({ teachingTopic });
       } else {
           res.json({ teachingTopic: null });
       }
   });
});
app.post('/verified-or-not', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const cookie = req.body.cookie;
   const sql = 'SELECT email_verified FROM users WHERE cookie = ?';
   db.query(sql, [cookie], (err, result) => {
       if (err) throw err;

       if (result.length > 0) {
           const email_verified = result[0].email_verified;
           let trueorfalse = true;
           if(email_verified == 0) trueorfalse = false
        
           res.json({ trueorfalse });
       } else {
           res.json({ email_verified: null });
       }
   });
});

app.get('/main', (req, res, next) => {
   const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
   
    const cookie = req.cookies['EDUHOME-COOKIE'];
    if (cookie) {
        const sql = 'SELECT username FROM users WHERE cookie = ?';
        db.query(sql, [cookie], (err, result) => {
            if (err) throw err;
            
            if (result.length > 0) {
                const username = result[0].username;
                res.locals.username = username; 
            }
            next(); 
        });
    } else {
        next(); 
    }
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const sql = 'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?';
  db.query(sql, [usernameOrEmail, usernameOrEmail, password], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
          const user = result[0];
          const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
          res.cookie('EDUHOME-COOKIE', user.cookie, { maxAge: oneMonthInMillis });
          const role= result[0].role

          //res.redirect('./dashboard/home.html');
          if(role == "teacher" || role =="Teacher"){
            res.redirect("./dashboard/home.html")
             }else if(role =="staff" || role == "Staff" || role =="Admin" || role == "admin"){
      
                res.redirect("./admin/home.html")
             }else{
                res.redirect("./students/main.html")
             }
         
      } else {
          res.status(401).json({ success: false, message: "Incorrect username/email or password" });
      }
  });
});

app.delete('/delete-question/:id', (req, res) => {
  const questionId = req.params.id;

 
  const query = 'DELETE FROM questions WHERE id = ?';
  db.query(query, [questionId], (err, result) => {
      if (err) {
          console.error('Error deleting question:', err);
          res.json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});

// Assuming you have a route for editing a question
app.put('/edit-question/:id', (req, res) => {
  const questionId = req.params.id;
  const { question, answerA, answerB, answerC, answerD, trueAnswer } = req.body;

  // Assuming you're using a MySQL database
  const query = 'UPDATE questions SET question = ?, answerA = ?, answerB = ?, answerC = ?, answerD = ?, trueAnswer = ? WHERE id = ?';
  const values = [question, answerA, answerB, answerC, answerD, trueAnswer, questionId];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error updating question:', err);
          res.json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});

app.get('/edit-question/:id', (req, res) => {
  const questionId = req.params.id;
  const query = 'SELECT * FROM questions WHERE id = ?';
  db.query(query, [questionId], (err, result) => {
      if (err) {
          console.error('Error fetching question:', err);
          res.json({ success: false });
          return;
      }

      if (result.length === 0) {
          res.json({ success: false, message: 'Question not found' });
          return;
      }

      const question = result[0];
      res.json({ success: true, question });
  });
});

app.put('/update-password/:cookie', (req, res) => {
  const questionId = req.params.cookie;
  const { password, secret } = req.body;
  if(secret !== secretInput){
    return
  }

  const query = 'UPDATE users SET password=? WHERE cookie=?';
  const values = [password, questionId];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error updating user password:', err);
          res.json({ success: false });
          return;
      }

      res.json({ success: true });
  });
});
app.post('/get-user-password-by-cookie', (req, res) => {

  const { secret, cookie } = req.body;
  if(secret !== secretInput){
    return
  }

  const query = 'SELECT password FROM users WHERE cookie=?';
  const values = [cookie];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error updating user password:', err);
          res.json({ success: false });
          return;
      }
      const password = result[0].password
      res.json(password);
  });
});

app.post('/add-question', (req, res) => {
   const { secret } = req.body
   
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const { question, answerA, answerB, answerC, answerD, trueAnswer, topic, unit } = req.body;
 
    // Get the current date and time
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-GB', options);
    const checkQuestionSql = 'SELECT * FROM questions WHERE question = ?';

    if (!question) {
      res.json({ message: 'Invalid question', success: false });
      return;
    }
    
    db.query(checkQuestionSql, [question], (err, result) => {
      if(err) return console.log("Errora: " + err)
      
      if (result.length > 0) {
        res.json({ message: 'Question like that already added!', success: false });
        return
    }else{


    const query = 'INSERT INTO questions (question, answerA, answerB, answerC, answerD, trueAnswer, topic, dateAdded, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [question, answerA, answerB, answerC, answerD, trueAnswer, topic, formattedDate, unit];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error saving question:', err);
            res.json({ success: false, message: `Error occured` });
            return;
        }
        
        res.json({ success: true });
    });
  }
})
});
app.post('/add-announcement', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const { title, content, topic, sender } = req.body;
   
   // Get the current date and time
   const now = new Date();
   const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
   const date = now.toLocaleDateString('en-GB', options);

 
    
  
   const query = 'INSERT INTO announcements (title, content, topic, sender, date) VALUES (?, ?, ?, ?, ?)';
   const values = [title, content, topic, sender, date];

   db.query(query, values, (err, result) => {
       if (err) {
           console.error('Error saving question:', err);
           res.json({ success: false, message: `Error occured` });
           return;
       }
       
       res.json({ success: true });
   });


});
app.post('/add-track', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const { type, topic, unit } = req.body;
   


   const now = new Date();
   const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
   const formattedDate = now.toLocaleDateString('en-GB', options);
   const query = 'INSERT INTO tracking (type, topic, dateAdded, chapter) VALUES (?, ?, ?, ?)';
   const values = [type, topic, formattedDate, unit];

   db.query(query, values, (err, result) => {
       if (err) {
           console.error('Error saving tracking:', err);
           res.json({ success: false });
           return;
       }
       
       res.json({ success: true });
   });
});

app.post('/add-unit', (req, res) => {
  const { secret } = req.body
 if(secret !== secretInput) {
   res.json("Get away")
   return "Get away"
 }
   const { topic, name, number } = req.body;
   

   const query = 'INSERT INTO unit (topic, name, number) VALUES (?, ?, ?)';
   const values = [topic, name, number];

   db.query(query, values, (err, result) => {
       if (err) {
           console.error('Error saving tracking:', err);
           res.json({ success: false });
           return;
       }
       
       res.json({ success: true });
   });
});
app.post('/get-units', async (req, res) => {

    const { secret, topic } = req.body
    if(secret !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
   db.query('SELECT * FROM unit WHERE topic = ?', [topic], (err, rows) => {

  if(err){
    res.status(500).json({ error: 'Internal Server Error' });
    return console.log(err)
  }
    res.json(rows);
    
    
   
  });

});
app.delete("/delete-question:id", (req, res) => {
   const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const itemId = req.params.id;
    const sql = "DELETE FROM questions WHERE id = ?";
    
    db.query(sql, [itemId], (err, result) => {
      if (err) {
        console.error("Error deleting question", err);
        return res.status(500).json({
          error: 'Error deleting question'
        });
      }
      
      res.json({ message: "Question deleted successfully" });
    });
  });

  app.post('/questions', (req, res) => {
    const { secret } = req.body
    if(secret !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
      const sql = 'SELECT * FROM questions';
  
     db.query(sql, (err, names) => {
          if (err) {
              console.error('Error fetching questions:', err.message);
              return res.status(500).json({
                  error: 'Error fetching questions'
              });
          }
          res.json(names);
          
         
      });
  });
  app.post('/announcements', (req, res) => {
    const { secret } = req.body
    if(secret !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
      const sql = 'SELECT * FROM announcements';
  
     db.query(sql, (err, names) => {
          if (err) {
              console.error('Error fetching questions:', err.message);
              return res.status(500).json({
                  error: 'Error fetching questions'
              });
          }
          res.json(names);
          
         
      });
  });

  app.post('/users', (req, res) => {
    const { secret } = req.body
    if(secret !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
      const sql = 'SELECT * FROM users';
  
     db.query(sql, (err, names) => {
          if (err) {
              console.error('Error fetching users:', err.message);
              return res.status(500).json({
                  error: 'Error fetching users'
              });
          }
          res.json(names);
          
         
      });
  });
  app.post('/tracks', (req, res) => {
    const { secret } = req.body
    if(secret !== secretInput) {
      res.json("Get away")
      return "Get away"
    }
      const sql = 'SELECT * FROM tracking';
  
     db.query(sql, (err, names) => {
          if (err) {
              console.error('Error fetching questions:', err.message);
              return res.status(500).json({
                  error: 'Error fetching questions'
              });
          }
          res.json(names);
      
         
      });
  });
async function getJizz(){
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, names) => {
         if (err) {
             console.error('Error fetching questions:', err.message);
            
         }
     
         
        
     });
}
app.post('/update-user/:id', (req, res) => {

  const userId = parseInt(req.params.id);
  const updatedData = req.body;

  // Assuming you have a table named 'orders' with a primary key 'id'
  const query = 'UPDATE users SET ? WHERE id = ?';

  db.query(query, [updatedData, userId], (err, result) => {
      if (err) {
          console.error('Error updating order:', err);
          res.json({ success: false, message: 'Error occurred' });
          return;
      }

      res.json({ success: true });
  });
});
app.post('/update-class/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { grade, letter, leader } = req.body;


  if (!userId) {
    res.json({ success: false, message: 'Invalid ID' });
    return;
  }

  const query = 'UPDATE classes SET grade = ?, letter = ?, leader = ? WHERE id = ?';

  db.query(query, [grade, letter, leader, userId], (err, result) => {
    if (err) {
      console.error('Error updating class:', err);
      res.json({ success: false, message: 'Error occurred' });
      return;
    }

    if (result.affectedRows === 0) {
      res.json({ success: false, message: 'No class found with this ID' });
      return;
    }

    res.json({ success: true });
  });
});

app.post('/update-question/:id', (req, res) => {

  const userId = parseInt(req.params.id);
  const updatedData = req.body;

 
  const query = 'UPDATE questions SET ? WHERE id = ?';

  db.query(query, [updatedData, userId], (err, result) => {
      if (err) {
          console.error('Error updating order:', err);
          res.json({ success: false, message: 'Error occurred' });
          return;
      }

      res.json({ success: true });
  });
});
app.delete('/delete-user/:id', (req, res) => {
  const id = req.params.id;

 
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting user:', err);
          res.json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});
app.delete('/delete-class/:id', (req, res) => {
  const id = req.params.id;

 
  const query = 'DELETE FROM classes WHERE id = ?';
  db.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting class:', err);
          res.json({ success: false });
          return;
      }
      res.json({ success: true });
  });
});
app.post('/get-users', (req, res) => {
  const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const sql = 'SELECT * FROM users';

   db.query(sql, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({
                error: 'Error fetching users'
            });
        }

        res.json(users);
        
       
    });
});
app.post('/get-classes', (req, res) => {
  const { secret } = req.body
  if(secret !== secretInput) {
    res.json("Get away")
    return "Get away"
  }
    const sql = 'SELECT * FROM classes';

   db.query(sql, (err, users) => {
        if (err) {
            console.error('Error fetching classes:', err.message);
            return res.status(500).json({
                error: 'Error fetching classes'
            });
        }

        res.json(users);
        
       
    });
});
app.post("/get-user-info-by-id/:id", (req, res) => {
  const { secret } = req.body;
  const id = parseInt(req.params.id);
  if(secret !== secretInput){
    res.json("Get away")
    return "Get away"
  }
  const sql = `SELECT * FROM users WHERE id = ?`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({
          error: 'Error fetching users'
      });
  }

  res.json(result);
  })
})
app.post("/get-class-info-by-id/:id", (req, res) => {
  const { secret } = req.body;
  const id = parseInt(req.params.id);
  if(secret !== secretInput){
    res.json("Get away")
    return "Get away"
  }
  const sql = `SELECT * FROM classes WHERE id = ?`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching classes:', err.message);
      return res.status(500).json({
          error: 'Error fetching classes'
      });
  }

  res.json(result);
  })
})
app.post("/get-question-info-by-id/:id", (req, res) => {
  const { secret } = req.body;
  const id = parseInt(req.params.id);
  if(secret !== secretInput){
    res.json("Get away")
    return "Get away"
  }
  const sql = `SELECT * FROM questions WHERE id = ?`
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching questions:', err.message);
      return res.status(500).json({
          error: 'Error fetching questions'
      });
  }

  res.json(result);
  })
})
app.get('/orders', (req, res) => {
    res.sendFile(__dirname + '/public/display.html');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});