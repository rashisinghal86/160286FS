import router from '../utils/router.js';  

const store = new Vuex.Store({
    state: {
        // State variables
        auth_token: null,
        role: null,
        loggedIn: false,
        user_id: null,
    },
    mutations: {
        // Set user data in the state
        setUser(state) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    state.auth_token = user.authentication_token;
                    state.loggedIn = true;
                    state.user_id = user.admin?.id || user.customer?.id || user.professional?.id;

                    // Determine the user's role
                    if (user.admin) {
                        state.role = user.admin.role;
                    } else if (user.customer) {
                        state.role = user.customer.role;
                    } else if (user.professional) {
                        state.role = user.professional.role;
                    } else {
                        state.role = null;
                    }
                }
            } catch (error) {
                console.warn('Not logged in:', error);
            }
        },

        // Logout mutation
        logout(state) {
            // Clear local storage and Vuex state
            localStorage.removeItem('user');
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;

            // Redirect to the login page
            router.push('/homecss').catch(err => {
                console.error('Router push error:', err);
            });
        }
    },
    actions: {
        // Logout action to handle async operations
        async logout({ commit }) {
            try {
                const response = await fetch('/api/signout', { method: 'POST', credentials: 'include' });
                if (response.ok) {
                    console.log('Logout successful');
                    commit('logout'); // Commit the logout mutation
                } else {
                    console.error('Failed to logout:', await response.json());
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    }
});

// Initialize the user state on app load
store.commit('setUser');

export default store;