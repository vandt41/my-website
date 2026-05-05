let username, password, email;

document.getElementById('submitBtn').onclick = function () {
    if (document.getElementById('password').value != document.getElementById(`confirm_password`).value) {
        alert(`password is not the same as confirm password!`);
    }
    else {
        username = document.getElementById(`username`).value;
        password = document.getElementById(`password`).value;
        email = document.getElementById(`email`).value;
        alert(`Hello ${username}\nYour password is: ${password}\nEmail: ${email}`);
    }
}

