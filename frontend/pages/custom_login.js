export default {
    name: 'CustLogin',
    template: `
        <div>
            <h1>Custom Login</h1>
            <form @submit.prevent="handleSubmit">
                <label>Email</label>
                <input type="email" v-model="email" required>
                <label>Password</label>
                <input type="password" v-model="password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `,
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        handleSubmit() {
            // Handle form submission logic here
            console.log('Email:', this.email);
            console.log('Password:', this.password);
            // You can add your authentication logic here
        }
    }
};
