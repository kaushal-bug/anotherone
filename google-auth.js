// Google Authentication Configuration
const GOOGLE_CLIENT_ID = '156817395162-v210e3ijqqliplrhflppk6mg0v14unj4.apps.googleusercontent.com';
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
];

let googleAuth = {
    tokenClient: null,
    isInitialized: false,

    // Initialize Google Authentication
    initialize() {
        return new Promise((resolve, reject) => {
            // Load Google Identity Services
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => {
                this.tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: SCOPES.join(' '),
                    callback: (response) => {
                        if (response.error) {
                            reject(response);
                            return;
                        }
                        this.handleAuthResponse(response);
                        resolve(response);
                    }
                });
                this.isInitialized = true;
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // Handle Google Sign In
    async signIn() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        this.tokenClient.requestAccessToken();
    },

    // Handle Sign Out
    async signOut() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Handle Authentication Response
    async handleAuthResponse(response) {
        if (response.access_token) {
            // Get user profile information
            const userInfo = await this.getUserInfo(response.access_token);
            
            // Store user data
            const userData = {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture,
                role: await this.determineUserRole(userInfo.email),
                accessToken: response.access_token
            };

            // Save to session storage
            sessionStorage.setItem('user', JSON.stringify(userData));

            // Redirect based on role
            if (userData.role === 'intern') {
                window.location.href = 'intern.html';
            } else if (userData.role === 'manager') {
                window.location.href = 'manager.html';
            }
        }
    },

    // Get User Info from Google
    async getUserInfo(accessToken) {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.json();
    },

    // Determine user role based on email domain or pattern
    async determineUserRole(email) {
        // You can implement your own logic here to determine roles
        // For example, based on email patterns or by checking against a list
        if (email.includes('intern')) {
            return 'intern';
        } else if (email.includes('manager')) {
            return 'manager';
        }
        return 'intern'; // Default role for testing
    },

    // Check if user is authenticated
    isAuthenticated() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return !!user && !!user.accessToken;
    },

    // Get current user data
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }
};

// Export for global use
window.googleAuth = googleAuth; 