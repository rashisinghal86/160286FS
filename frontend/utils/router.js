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
import manage_customers from '../pages/manage_customers.js';
import messages from '../components/messages.js';
import pending_professionals from '../pages/pending_professionals.js';
import prof_booking from '../pages/prof_booking.js';
import prof_byrating from '../pages/prof_byrating.js';
import prof_db from '../pages/prof_db.js';
import professionals from '../pages/professionals.js';
import profile_admin from '../pages/profile_admin.js';
import profile_cust from '../pages/profile_cust.js';
import profile_prof from '../pages/profile_prof.js';
import rate_booking from '../pages/rate_booking.js';
import registercopy from '../pages/Registercopy.js';
import register_abd from '../pages/register_abd.js';
import register_cdb from '../pages/register_cdb.js';
import register_pdb from '../pages/register_pdb.js';
import schedule_edit from '../pages/schedule_edit.js';
import schedule from '../pages/schedule.js';
import Searchbar from '../pages/searchbar.js';
import searchbar2 from '../pages/searchbar2.js';
import searchbar3 from '../pages/searchbar3.js';
import verify_prof from '../pages/verify_prof.js';
import view_appointments from '../pages/view_appointments.js'
import profilewrapper from '../components/profilewrapper.js';
import Category from '../pages/category.js';
import service from '../pages/service.js';






const routes = [
    {path: '/', component: Home},
    {path: '/api/login', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/template', component: template},
    {path: '/home', component: home},
    {path: '/homecss', component: homecss},
    {path: '/registercopy', component: Registercopy},
    {path: '/add_to_schedule', component: add_to_schedule},
    {path: '/admin_booking', component: admin_booking},
    {path: '/api/admin_db', component: admin_db},
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
    {path: '/manage_customers', component: manage_customers},
    {path: '/messages', component: messages},
    {path: '/pending_professionals', component: pending_professionals},
    {path: '/prof_booking', component: prof_booking},
    {path: '/prof_byrating', component: prof_byrating},
    {path: '/prof_db', component: prof_db},
    {path: '/professionals', component: professionals},
    {path: '/profile_admin', component: profile_admin},
    {path: '/profile_cust', component: profile_cust},
    {path: '/profile_prof', component: profile_prof},
    {path: '/rate_booking', component: rate_booking},
    {path: '/registercopy', component: Registercopy},
    {path: '/register_abd', component: register_abd},
    {path: '/register_cdb', component: register_cdb},
    {path: '/register_pdb', component: register_pdb},
    {path: '/schedule_edit', component: schedule_edit},
    {path: '/schedule', component: schedule},
    {path: '/searchbar', component: Searchbar},
    {path: '/searchbar2', component: searchbar2},
    {path: '/searchbar3', component:searchbar3},
    {path: '/verify_prof', component:verify_prof},
    {path: '/view_appointments', component:view_appointments},
    { path: '/profile', component: profilewrapper },
    { path: '/categories', component: Category },
    {path: '/service', component: service},
    {path: '/api/categories/:id/services', component: service},
    













]

const router = new VueRouter({
    routes
})


// navigation guards
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
             next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
