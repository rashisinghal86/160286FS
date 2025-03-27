export default {
    name: 'home',
    template:`
    <div class="container mt-4">
    <h2 class="display-4">
        Household Services Application
    </h2>
    <div class="home">
        <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Logout" width="100" alt="avatar">
    </div>
    <h3 class="text-bold">
        You have successfully logged out of your account
    </h3>
    <hr>
    <h4>Would you like to?</h4>
    
    <div class="row">
        <div class="col-12">
        <button @click="goToHome" class="btn btn-info btn-lg btn-block">
        <i class="fa-solid fa-house fa-3x"></i>
        Go to Home
    </button>
        </div>
    </div>
</div>

    `
    ,
    data() {
        return {
            email : null,
            password : null,
            output : null,
        }
    },
 methods: { 
     async submitlogin() {
        // we should use try&catch block to handle errors 
        const response = await fetch(location.origin+'/login', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 email: this.email,
                 password: this.password
             })
         });
         
    if (response.ok) {
        console.log('login success');
        const data = await response.json();
        this.output = data;
        console.log(data);
        window.alert(data.email);
    }
    },
    goToHome() {
        this.$router.push('/homecss');
    }
 }
}  