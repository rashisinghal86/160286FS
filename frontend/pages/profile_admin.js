export default {
    template: `
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">
                <h1 class="display-4">
                    Hello <span class="text-muted">@{{ user.username }}</span>
                </h1>
                <div class="profile-pic">
                    <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Webmaster" width="100" alt="avatar">
                </div>
                <div class="signout mt-3">
                    <button @click="signout" class="btn btn-outline-danger">
                        <i class="fa-solid fa-lock"></i> Signout
                    </button>
                </div>
            </div>
            <div class="col-md-6">
                <h2 class="display-6">Edit Profile</h2>
                <br><br>
                <form @submit.prevent="updateProfile" class="form">
                    <div class="form-group">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" v-model="user.username" name="username" id="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="cpassword" class="form-label">Current Password</label>
                        <input type="password" v-model="cpassword" name="cpassword" id="cpassword" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password" class="form-label">New Password</label>
                        <input type="password" v-model="password" name="password" id="password" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" v-model="user.name" name="name" id="name" class="form-control">
                    </div>
                    <br>
                    <div class="form-group">
                        <input type="submit" value="Update" class="btn btn-primary">
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            user: {
                username: '',
                name: ''
            },
            cpassword: '',
            password: ''
        };
    },
    methods: {
        async fetchUserData() {
            const response = await fetch('/api/users');
            if (response.ok) {
                this.user = await response.json();
            }
        },
        async updateProfile() {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.user.username,
                    name: this.user.name,
                    cpassword: this.cpassword,
                    password: this.password
                })
            });
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        },
        async signout() {
            await fetch('/signout', { method: 'POST' });
            window.location.href = '/login';
        }
    },
    mounted() {
        this.fetchUserData();
    }
};
