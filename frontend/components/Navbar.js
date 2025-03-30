export default {
    props: ['loggedIn'],
    template: `
    <div class="row border">
        <div class="col-10 fs-2 border">
            Platform
        </div>
        <div class="col-2 border">
            <div class="mt-1">
            <router-link v-if="!$store.state.loggedIn" to='/homecss'>Home</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/api/login'>Login</router-link>
            <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>
            <router-link v-if="$store.state.loggedIn" to='/profile'>Profile</router-link>

            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/api/admin_db'>Home</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/admin_booking'>Overview</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/categories'>Service Management</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/pending_professionals'>Professional Management</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/manage_customers'>Customer Management</router-link>
            
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/prof_db'>Home</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/view_appointments'>Schedules</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Professional'" to='/prof_booking'>Bookings</router-link>

            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/cust_db'>Home</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/catalogue'>View Services</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/schedule'>Schedules</router-link>
            <router-link v-if="$store.state.loggedIn && $store.state.role == 'Customer'" to='/cust_bookings'>Bookings</router-link>


                
                <button v-if="$store.state.loggedIn" @click="logoutUser" class="btn btn-danger">Logout</button>

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
            localStorage.clear()
            this.$router.push('/home')
            this.$emit('logout')
        }
    }

}