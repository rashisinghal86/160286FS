export default {
    template:`
    <div>
        <div v-if="output">
            <p>{{output}}</p>
            <p> Password: {{output.password}} </p>
        </div>
        <div class="container mt-4 d-flex justify-content-center">
    <div class="card" style="width: 100%; max-width: 500px;">
        <div class="card-body">
            <h1 class="display-4 text-center">Login</h1>
            <form class="form">
                <div class="form-group">
                    <label for="username" class="form-label">Username</label>

                    <input type="text" placeholder='username' name="username" required class="form-control" v-model='email'>
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" placeholder='password' name="password" required class="form-control" v-model='password'>
                </div>
                <br>
                <div class="form-group text-center">
                    <button @click="submitlogin" class="btn btn-primary"> Login </button>

                </div>
            </form>
        </div>
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
}
 }
}  