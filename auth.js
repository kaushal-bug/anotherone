// Authentication utilities
const auth = {
    // Check if user is authenticated
    async checkAuth() {
        return this.isAuthenticated();
    },

    // Get user role
    async getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    },

    // Get user data
    async getUserData() {
        return this.getCurrentUser();
    },

    // Check if user is logged in
    isAuthenticated() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        return !!user;
    },

    // Get current user
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    },

    // Check if user has specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    // Login user
    login(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
    },

    // Logout user
    logout() {
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Redirect if not authenticated or wrong role
    requireAuth(role) {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        if (role && !this.hasRole(role)) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a protected page
    if (window.location.pathname.includes('intern.html')) {
        // If there's no authenticated user with intern role, redirect to login
        if (!auth.requireAuth('intern')) {
            return;
        }
    }
});

// Prevent going back to authenticated pages after logout
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        auth.requireAuth();
    }
});

// Make auth available globally
window.auth = auth; 