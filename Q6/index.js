// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    // Firebase endpoint to fetch all users
    const usersUrl = 'https://sampleproject-743f3-default-rtdb.firebaseio.com/users.json';

    // Fetch users data from Firebase
    fetch(usersUrl)
        .then(response => response.json())
        .then(data => {
            let authenticated = false;
            console.log(data);
            
            // Loop through users to find a match
            for (let key in data) {
                if (data[key].username === username && data[key].password === password) {
                    authenticated = true;
                    break;
                }
            }

            if (authenticated) {
                messageDiv.innerHTML = 'Login Successful';
                messageDiv.style.color = 'green';
                // Redirect to dashboard or another page upon successful login
                window.location.href = 'dashboard.html';  // Example redirect
            } else {
                messageDiv.innerHTML = 'Invalid credentials. Please try again.';
                messageDiv.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error fetching users data:', error);
            messageDiv.innerHTML = 'Error logging in. Please try again later.';
            messageDiv.style.color = 'red';
        });
});
