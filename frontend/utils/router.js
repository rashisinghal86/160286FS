const Home = {
    template : '<h1> this is Home </h1>'
    
}
import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/Register.js';
import template from '../pages/template.js';
import home from '../pages/home.js';
import homecss from '../pages/homecss.js';
import Registercopy from '../pages/Registercopy.js'; 
import add_to_schedule from '../pages/add_to_schedule.js';
import admin_booking from '../pages/admin_booking.js';
import admin_db from '../pages/admin_db.js';
import block_cust from '../pages/block_cust.js';
import booking from '../pages/booking.js';
import bookings from '../pages/bookings.js';
import catalogue from '../pages/catalogue.js';
import cust_bookings from '../pages/cust_bookings.js';
import cust_db from '../pages/cust_db.js';
import custom_login from '../pages/custom_login.js';
import customers from '../pages/customers.js';
import delete_user from '../pages/delete_user.js';
import flag_prof from '../pages/flag_prof.js';
import layout from '../pages/layout.js';
import login_copy from '../pages/login_copy.js';









const routes = [
    {path: '/', component: Home},
    {path: '/login', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/template', component: template},
    {path: '/home', component: home},
    {path: '/homecss', component: homecss},
    {path: '/registercopy', component: Registercopy},
    {path: '/add_to_schedule', component: add_to_schedule},
    {path: '/admin_booking', component: admin_booking},
    {path: '/admin_db', component: admin_db},
    {path: '/block_cust', component: block_cust},
    {path: '/booking', component: booking },
    {path: '/bookings', component: bookings },
    {path: '/catalogue', component: catalogue }, 
    {path: '/cust_bookings', component: cust_bookings },
    {path: '/cust_db', component: cust_db},
    {path: '/custom_login', component: custom_login},
    {path: '/customers', component: customers},
    {path: '/delete_user', component: delete_user},
    {path: '/flag_prof', component: flag_prof},
    {path: '/layout', component: layout},
    {path: '/login_copy', component: login_copy},













]

const router = new VueRouter({
    routes
})

export default router;
