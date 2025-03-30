export default {
    name: 'Navbar',
    template: `
    <div class="row border">
        <div class="col-8 fs-2 fw-bold text-center border">
            Platform Household Services 
        </div>
        <div class="col-4 border">
            <div class="mt-1">
                <router-link v-if="!loggedIn" to='/homecss'> Home |</router-link>
                <router-link v-if="!loggedIn" to='/api/login'> Login |</router-link>
                <router-link v-if="!loggedIn" to='/register'> Register |</router-link>
                <router-link v-if="loggedIn" to='/profile'> Profile |</router-link>

                <router-link v-if="loggedIn && role === 'Admin'" to='/api/admin_db'> Home |</router-link>
                <router-link v-if="loggedIn && role === 'Admin'" to='/admin_booking'> Overview |</router-link>
                <router-link v-if="loggedIn && role === 'Admin'" to='/categories'> Services |</router-link>
                <router-link v-if="loggedIn && role === 'Admin'" to='/pending_professionals'> Professionals |</router-link>
                <router-link v-if="loggedIn && role === 'Admin'" to='/manage_customers'> Customers </router-link>
                
                <router-link v-if="loggedIn && role === 'Professional'" to='/prof_db'> Home |</router-link>
                <router-link v-if="loggedIn && role === 'Professional'" to='/view_appointments'> Schedules |</router-link>
                <router-link v-if="loggedIn && role === 'Professional'" to='/prof_booking'> Bookings |</router-link>

                <router-link v-if="loggedIn && role === 'Customer'" to='/cust_db'> Home |</router-link>
                <router-link v-if="loggedIn && role === 'Customer'" to='/catalogue'>View Services |</router-link>
                <router-link v-if="loggedIn && role === 'Customer'" to='/schedule'>Schedules |</router-link>
                <router-link v-if="loggedIn && role === 'Customer'" to='/cust_bookings'>Bookings |</router-link>

                <button v-if="loggedIn" @click="logoutUser" class="btn btn-danger ms-auto d-block">Logout</button>
            </div>
        </div>
    </div>`,
    computed: {
        loggedIn() {
            return this.$store.state.loggedIn; // Reactive binding to Vuex state
        },
        role() {
            return this.$store.state.role; // Reactive binding to Vuex state
        }
    },
    methods: {
        logoutUser() {
            // Clear localStorage
            localStorage.clear();
            
            // Update Vuex store state
            this.$store.commit('setUser', {
                auth_token: null,
                role: null,
                loggedIn: false,
                user_id: null
            });

            // Redirect to the home page
            this.$router.push('/home');
        }
    }
};