export default {
    props: ['loggedIn'],
    template: `
    <div class="row border">
        <div class="col-8 fs-2 fw-bold text-center border">
            Platform Household Services 
        </div>
        <div class="col-4 border ">
            <div class="mt-1">
            <router-link v-if="!$store.state.loggedIn" to='/homecss'> Home |</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/api/login'> Login |</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/register'> Register |</router-link>
            <router-link v-if="$store.state.loggedIn" to='/profile'> Profile |</router-link>

            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/api/admin_db'> Home |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/admin_booking'> Overview |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/categories'> Services |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/pending_professionals'> Professionals |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/manage_customers'> Customers </router-link>
            
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/prof_db'> Home |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/view_appointments'> Schedules |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/prof_booking'> Bookings |</router-link>

            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/cust_db'> Home |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/catalogue'>View Services |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/schedule'>Schedules |</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/cust_bookings'>Bookings |</router-link>

                
                <button v-if="$store.state.loggedIn" @click="logoutUser" class="btn btn-danger ms-auto d-block" >Logout</button>

            </div>
        </div>
    </div>`,
    data: function(){
        return {
            loggedIn: localStorage.getItem('auth_token')
        }
    },
    methods:{
        logoutUser(){
            localStorage.clear();
            
            this.$store.commit('setUser', {
                auth_token: null,
                role: null,
                loggedIn: false,
                user_id: null
            });
            

            this.$router.push('/home')
            this.$emit('logout')
        }
    }

}