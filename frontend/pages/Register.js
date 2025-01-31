export default {
    template:`
    <div>
        
    <div class="container mt-4 d-flex justify-content-center">
    <div class="card" style="width: 100%; max-width: 700px;">
        <div class="card-body">
            <h1 class="display-4 text-center">Register</h1>


                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <input type="username" name="username" required class="form-control" v-model='email'>
                </div>
                
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" name="password" required class="form-control" v-model='password'>
                </div>
            <!--
                <div class="form-group">
                    <label for="confirm-password" class="form-label">Confirm Password</label>
                    <input type="password" name="confirm_password" required class="form-control" v-model='password' >
                </div>
                --> 
            <div>
            <div>
                <label for="role" class="form-label">Role</label>
                <select name="role_name" id="role" class="form-control" v-model="selectedRole" required>
                <option> user </option> 
                <option> professional </option>
                <option> customer </option>
                </select>
            </div>          
                <br>
                <div class="form-group button-container">
                <button @click="submitregister" class="btn btn-primary">Register </button>

                </div>
            
        </div>
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
            selectedRole: null,

        }
    },
   

       
 methods: {
    
     async submitregister() {
        // we should use try&catch block to handle errors 
        const response = await fetch(location.origin+'/register', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 email: this.email,
                 password: this.password,
                 role_name: this.selectedRole
             })
         });
         
    if (response.ok) {
        console.log('register success');
        const data = await response.json();
        this.output = data;
        window.alert('Register success');
    }
}
 }
}  