export default {
    template: `
        <div class="container mt-1">
            <h1 class="display-1">Welcome {{ professional.name }}</h1>
            <h2 class="display-4">Your account is under verification</h2>
            <h5>Wait for Admin Approval.</h5>
            <a href="/signout" class="btn btn-danger btn-lg">EXIT</a>
        </div>
    `,
    data() {
        return {
            professional: {
                name: 'Professional Name' // Replace with dynamic data as needed
            }
        };
    }
};
