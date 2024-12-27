const userManager = {
    currentUser: null,

    async registerUser(name, email, password) {
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            this.currentUser = data.user;
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async loginUser(email, password) {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            this.currentUser = data.user;
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logoutUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    },

    getCurrentUser() {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        }
        return this.currentUser;
    },

    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
};

// Export for use in other files
window.userManager = userManager;
