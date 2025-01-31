const Home = {
    template : '<h1> this is Home </h1>'
    
}
import LoginPage from '../pages/LoginPage.js';
import RegisterPage from '../pages/Register.js';
import template from '../pages/template.js';
import home from '../pages/home.js';


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: LoginPage},
    {path: '/register', component: RegisterPage},
    {path: '/template', component: template},
    {path: '/home', component: home}

]

const router = new VueRouter({
    routes
})

export default router;
