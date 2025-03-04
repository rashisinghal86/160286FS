export default {
  template: `
  <div>
      <div v-if="output">
          <p>{{ output }}</p>
          <p>Password: {{ output.password }}</p>
      </div>
      <div class="container mt-4 d-flex justify-content-center">
          <div class="card" style="width: 100%; max-width: 500px;">
              <div class="card-body">
                  <h1 class="display-4 text-center">Login</h1>
                  <form class="form" @submit.prevent="submitlogin">
                      <div class="form-group">
                          <label for="email" class="form-label">Email</label>
                          <input type="text" placeholder="abc@example.com" name="email" required class="form-control" v-model="email">
                      </div>
                      <div class="form-group">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" placeholder="password" name="password" required class="form-control" v-model="password">
                      </div>
                      <br>
                      <div class="form-group text-center">
                          <button type="submit" class="btn btn-primary">Login</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
  `,
  data() {
      return {
          email: null,
          password: null,
          output: null,
      };
  },
  
  methods: {
      async submitlogin() {
          try {
              const response = await fetch(location.origin + '/api/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                  },
                  body: JSON.stringify({
                      email: this.email,
                      password: this.password
                  })
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              
              const data = await response.json();
              localStorage.setItem('token', data.authentication_token);
              this.output = data;
              console.log("Login Successful:", data);
              window.alert(`Login Success: ${data.email}`);
              this.$store.commit('setUser')
              if (data.customer.role == 'Customer') {
                  this.$router.push('/cust_db');
                  window.alert("Login Success",data.customer.role);
               }
                //   if (data.professional.role == 'Professional') {
                //       this.$router.push('/prof_db');
                //       // window.alert("Login Success",data.professional.role);
                //   }  
              // else if (data.admin.role == 'Admin') {
              //     this.$router.push('/api/admin_db');
              //     window.alert("Login Success",data.admin.role);
              //  }
          } catch (error) {
              console.error("Login Error:", error);
              window.alert("Login Failed. Please check your credentials.");
          }
      },
  }
};