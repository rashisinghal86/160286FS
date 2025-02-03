export default {
    template: `
    <div>
        <div class="container mt-4 d-flex justify-content-center">
            <div class="card" style="width: 100%; max-width: 700px;">
                <div class="card-body">
                    <h1 class="display-4 text-center">Register</h1>

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
                        <select name="role_name" id="role" class="form-control" v-model="selectedRole" required>
                            <option value="customer">Customer</option>
                            <option value="professional">Professional</option>
                        </select>
                    </div>

                    <br>
                    <div class="form-group button-container">
                        <button @click="submitRegister" class="btn btn-primary">Register</button>
                    </div>
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
            selectedRole: null
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
                const response = await fetch(location.origin + '/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.email,
                        username: this.username,
                        password: this.password,
                        confirm_password: this.confirmPassword,
                        role_name: this.selectedRole
                    })
                });

                if (response.ok) {
                    console.log('Register success');
                    const data = await response.json();
                    window.alert('Registration successful!');
                } else {
                    const errorData = await response.json();
                    window.alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Registration failed:", error);
                window.alert("An error occurred. Please try again.");
            }
        }
    }
}
