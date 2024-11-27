const secret111 = '>#jc=Wer6WkmN9vb<Ue1(363($Griz';
        
fetch('/get-users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ secret: secret111 })
})
.then((response) => response.json())
.then((users) => {

    let students = 0;
    let teachers = 0;
    let admins = 0;
    users.forEach(user => {
        if(user.role == "teacher"){
            teachers++
        }else if(user.role == "admin" || user.role == "staff"){
            admins++
        }else{
            students++
        }

    });
    document.getElementById("totalAdmins").textContent = admins
    document.getElementById("totalTeachers").textContent = teachers
    document.getElementById("totalStudents").textContent = students
})