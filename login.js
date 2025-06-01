// User credentials (in a real app, this would be on a server)
const users = {
    interns: [
        { username: 'intern1', password: 'pass123' },
        { username: 'intern2', password: 'pass123' }
    ],
    managers: [
        { username: 'manager', password: 'admin123' }
    ]
};

// Role selection
function selectRole(role) {
    document.getElementById('roleSelection').classList.add('hidden');
    document.getElementById(`${role}LoginForm`).classList.remove('hidden');
}

// Show role selection
function showRoleSelection() {
    document.querySelectorAll('.login-form').forEach(form => form.classList.add('hidden'));
    document.getElementById('roleSelection').classList.remove('hidden');
}

// Handle login errors
function showError(message) {
    alert(message);
}

// Redirect to appropriate page
function redirectToPage(type) {
    try {
        const pages = {
            intern: 'intern.html',
            manager: 'manager.html'
        };
        
        const page = pages[type];
        if (!page) {
            throw new Error('Invalid user type');
        }

        // Get the current directory path
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        
        // Construct the full URL
        const redirectUrl = new URL(page, window.location.origin + basePath).href;
        
        // Redirect
        window.location.href = redirectUrl;
    } catch (error) {
        console.error('Redirect error:', error);
        showError('Error accessing dashboard. Please try again.');
    }
}

// Handle intern login
document.getElementById('internLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('internUsername').value;
        const password = document.getElementById('internPassword').value;

        const user = users.interns.find(u => u.username === username && u.password === password);
        if (user) {
            // Store user info in sessionStorage
            sessionStorage.setItem('user', JSON.stringify({ 
                username, 
                type: 'intern',
                name: username.charAt(0).toUpperCase() + username.slice(1)
            }));
            redirectToPage('intern');
        } else {
            showError('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
});

// Handle manager login
document.getElementById('managerLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('managerUsername').value;
        const password = document.getElementById('managerPassword').value;

        const user = users.managers.find(u => u.username === username && u.password === password);
        if (user) {
            // Store user info in sessionStorage
            sessionStorage.setItem('user', JSON.stringify({ 
                username, 
                type: 'manager',
                name: 'Manager'
            }));
            redirectToPage('manager');
        } else {
            showError('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
}); 