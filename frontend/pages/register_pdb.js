export default {
    data() {
        return {
            email: '',
            name: '',
            contact: '',
            serviceType: '',
            experience: '',
            location: '',
            isVerified: false,
            isFlagged: false,
            file: null,
            categories: [] // This should be fetched from the backend
        };
    },
    methods: {
        async submitForm() {
            const formData = new FormData();
            formData.append('email', this.email);
            formData.append('name', this.name);
            formData.append('contact', this.contact);
            formData.append('service_type', this.serviceType);
            formData.append('experience', this.experience);
            formData.append('location', this.location);
            formData.append('is_verified', this.isVerified);
            formData.append('is_flagged', this.isFlagged);
            formData.append('file', this.file);
            
            try {
                const response = await fetch('/register_pdb', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    alert('Registration successful!');
                } else {
                    alert('Registration failed.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        },
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        async fetchCategories() {
            try {
                const response = await fetch('/get_categories'); // Adjust this API endpoint accordingly
                this.categories = await response.json();
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
    },
    mounted() {
        this.fetchCategories();
    },
    template: `
        <div>
            <h1>Welcome Professional</h1>
            <h2>Fill your profile details and wait for admin approval</h2>
            <form @submit.prevent="submitForm" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" v-model="name" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="contact">Contact</label>
                    <input type="number" v-model="contact" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="service_type">Service Type</label>
                    <select v-model="serviceType" required class="form-control">
                        <option value="" disabled>Select a service type</option>
                        <option v-for="category in categories" :key="category.name" :value="category.name">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="experience">Experience</label>
                    <input type="number" v-model="experience" min="0" required class="form-control">
                </div>
                <div class="form-group">
                    <label for="location">Location</label>
                    <input type="text" v-model="location" required class="form-control">
                </div>
                <div class="form-group">
                    <input type="file" @change="handleFileUpload" required>
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
            </form>
        </div>
    `
};
