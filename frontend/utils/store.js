const store = new Vuex.Store({
    state : {
        // like data
        auth_token : null,
        role : null,
        loggedIn : false,
        user_id : null,
    },
    mutations : {
        // functions that change state
        setUser(state) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    state.auth_token = user.authentication_token;
                    state.loggedIn = true;
                    state.user_id = user.admin?.id || user.customer?.id || user.professional?.id;
        
                    // Correctly extract role based on user type
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
                console.warn('Not logged in');
            }
        }
        ,

        logout(state){
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;

            localStorage.removeItem('user')
        }
    },
    actions : {
        
        
    }
})

store.commit('setUser')

export default store;