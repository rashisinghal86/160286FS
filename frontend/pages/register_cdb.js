export default {
    template: `
        <div class="container mt-4">
            <h1>Welcome, Customer</h1>
            <p>Update your profile before you can view your appointments</p>

            <form @submit.prevent="submitForm" class="form">
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" v-model="email" required class="form-control">
                </div>    
                <div class="form-group">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" v-model="name" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" v-model="username" required class="form-control">
                </div>
                <div class="form-group">    
                    <label for="contact" class="form-label">Contact</label>
                    <input type="number" v-model="contact" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="location" class="form-label">Location</label>
                    <input type="text" v-model="location" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" v-model="password" required class="form-control">
                </div>  
                <div class="form-group">
                    <input type="hidden" v-model="isBlocked" value="False">       
                </div>
                <br>
                
                <div class="form-group button-container">
                    <input type="submit" value="Show my page" class="btn btn-primary">
                </div>
            </form>
        </div>
    `,
    
    data() {
        return {
            email: '',
            name: '',
            username: '',
            contact: '',
            location: '',
            password: '',
            isBlocked: false
        };
    },

    methods: {
        submitForm() {
            console.log("Form submitted with:", {
                email: this.email,
                name: this.name,
                username: this.username,
                contact: this.contact,
                location: this.location,
                password: this.password,
                isBlocked: this.isBlocked
            });
            alert("Profile updated successfully!");
        }
    }
};
