export default {
    template:`
    <div class="container mt-4 d-flex justify-content-center">
    <div class="card" style="width: 100%; max-width: 500px;">
      <div class="card-body">
        <h1 class="display-4 text-center">Login</h1>
        <form @submit.prevent="submitLogin" class="form">
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              v-model="username"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              v-model="password"
              required
              class="form-control"
            />
          </div>
          <br />
          <div class="form-group text-center">
            <input type="submit" value="Login" class="btn btn-primary" />
          </div>
        </form>
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