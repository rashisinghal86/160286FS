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
                            <input 
                                type="text" 
                                placeholder="abc@example.com" 
                                name="email" 
                                required 
                                class="form-control" 
                                v-model="email"
                            >
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                placeholder="password" 
                                name="password" 
                                required 
                                class="form-control" 
                                v-model="password"
                            >
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
                    const errorData = await response.json();
                    if (response.status === 403) {
                      if (errorData.message === 'Customer is blocked') {
                        window.alert("Your account has been blocked. Please wait for further instructions.");
                      } else if (errorData.message === 'Professional is flagged') {
                        window.alert("Your account has been flagged. Please wait for further instructions.");
                      } else if (errorData.message === 'Professional is under verification') {
                        window.alert("Your account is under verification. Please wait for further instructions.");
                      } else {
                        window.alert("Login Failed. Please check your credentials.");
                      }
                    } else {
                      window.alert("Login Failed. Please check your credentials.");
                    }
                    return;
                }
                
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('token', data.authentication_token);
                this.output = data;
                console.log("Login Successful:", data);
                window.alert(`Login Success`);
                this.$store.commit('setUser');
  
                if (data.admin?.role === 'Admin') {
                    this.$router.push('/api/admin_db');
                    window.alert("Access Authorized to Admin Dashboard");
                } else if (data.customer?.role === 'Customer') {
                    if (data.customer.is_blocked === true) {
                        window.alert("Your account has been blocked. Please wait for further instructions.");
                    } else {
                    this.$router.push('/cust_db');
                    window.alert("Access Authorized to Customer Dashboard");
                    }
                } else if (data.professional?.role === 'Professional') {
                    if (data.professional.is_flagged === true) {
                        window.alert("Your account has been flagged. Please wait for further instructions.");
                      } else if (data.professional.is_verified === false) {
                        window.alert("Your account is under verification. Please wait for further instructions.");
                      } else {
                        this.$router.push('/prof_db');
                        window.alert("Access Authorized to Professional Dashboard");
                      }                
                    } else {
                    window.alert("Invalid email or password. Please try again.");
                }
            } catch (error) {
                console.error("Login Error:", error);
                window.alert("Login Failed. Please check your credentials.");
            }
        },
    }
  };
