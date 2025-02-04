export default {
    template:`
    <template>
  <div>
    <h1 class="display-4 text-center">Register</h1>
    <form @submit.prevent="submitRegister">
      <div class="form-group">
        <label for="username" class="form-label">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="confirm-password" class="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirm_password"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="role" class="form-label">Role</label>
        <select id="role" v-model="selectedRole" class="form-control" required>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>
      <br />
      <div class="form-group button-container">
        <input type="submit" value="Register" class="btn btn-primary" />
      </div>
    </form>
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