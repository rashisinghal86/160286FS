export default {
    template : `
    <div>
        <router-link to='/homecss'>Home</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/api/login'>Login</router-link>
        <router-link v-if="!$store.state.loggedIn" to='/register'>Register</router-link>

        <router-link v-if="$store.state.loggedIn" to='/profile'>Profile</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/admin_booking'>Overview</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/add_category'>Service Management</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/pending_professionals'>Professional Management</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/manage_customers'>Customer Management</router-link>


        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/admin_db'>Admin Dashboard</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'Admin'" to='/'>Admin Dashboard</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'customer'" to='/api/login'>customerlogin</router-link>
        <router-link v-if="$store.state.loggedIn && $store.state.role == 'professional'" to='/api/login'>profflogin</router-link>
        #signout
        <router-link v-if="$store.state.loggedIn" to='/api/signout' @click.native="logout">Logout</router-link>


    </div>
    `
}