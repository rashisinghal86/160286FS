export default {
    template: `
    <div>
        <div class="container mt-4 d-flex justify-content-center">
            <div class="card" style="width: 100%; max-width: 700px;">
                <div class="card-body">
                    <h1 class="display-4 text-center">Register</h1>

                    <form @submit.prevent="submitRegister">
                        <div class="form-group">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name="email" required class="form-control" v-model="email">
                        </div>

                        <div class="form-group">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" name="username" required class="form-control" v-model="username">
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" name="password" required class="form-control" v-model="password">
                        </div>

                        <div class="form-group">
                            <label for="confirm-password" class="form-label">Confirm Password</label>
                            <input type="password" name="confirm_password" required class="form-control" v-model="confirmPassword">
                        </div>

                        <div class="form-group">
                            <label for="role" class="form-label">Role</label>
                            <select name="role" id="role" class="form-control" v-model="selectedRole" required>
                                <option value="" disabled>Select a role</option>
                                <option value="Customer">Customer</option>
                                <option value="Professional">Professional</option>
                            </select>
                        </div>

                        <br>
                        <div class="form-group text-center">
                            <button type="submit" class="btn btn-primary">Register</button>
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
            username: null,
            password: null,
            confirmPassword: null,
            selectedRole: null,
            output: null
        };
    },
    methods: {
        async submitRegister() {
            if (!this.email || !this.username || !this.password || !this.confirmPassword || !this.selectedRole) {
                window.alert("All fields are required.");
                return;
            }

            if (this.password !== this.confirmPassword) {
                window.alert("Passwords do not match.");
                return;
            }

            try {
                const response = await fetch(window.location.origin + '/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.email,
                        username: this.username,
                        password: this.password,
                        confirm_password: this.confirmPassword,
                        role: this.selectedRole  // Ensure backend expects "role" instead of "role_name"
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.authentication_token);
                    this.output = data;
                    console.log("Registration Successful:", data);
                    window.alert(`Registration successful! Welcome, ${this.username}`);
                    this.$store.commit('setUser');
            
                    // Simulating login process after registration
                    localStorage.setItem('email', this.email);
                    localStorage.setItem('role', this.selectedRole);
            
                    // Redirect based on role
                    if (this.selectedRole === 'Customer') {
                      this.$router.push('/cust_db');
                    } else if (this.selectedRole === 'Professional') {
                      this.$router.push('/verify_prof');
                    }
                } else {
                    const errorData = await response.json();
                    window.alert(`Error: ${errorData.message || "Something went wrong."}`);
                    console.error("Response Error:", errorData);
                }
            } catch (error) {
                console.error("Registration failed:", error);
                window.alert("An error occurred. Please try again.");
            }
        }
    }
}
