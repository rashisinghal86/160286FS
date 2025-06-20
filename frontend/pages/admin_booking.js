export default {
    template: `
    <div class="container mt-4">
        <button class="btn btn-primary" @click="printPage" style="float: right;">
            <i class="fas fa-print" aria-hidden="true"></i>
            Print
        </button>

        <h1 class="display-4">Admin Overview</h1>
        <hr>
        <br>
        <h2>Schedules in Waiting</h2>
        <table class="table table-striped">
            <thead class="thead-light">
                <tr>
                    <th>Schedule ID</th>
                    <th>Service Name</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Schedule Date</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in schedules" :key="schedule.id">
                    <td>{{ schedule.id }}</td>
                    <td>{{ schedule.service.name }}</td>
                    <td>{{ schedule.service.price }}</td>
                    <td>{{ schedule.location }}</td>
                    <td>{{ schedule.schedule_datetime }}</td>
                </tr>
            </tbody>
        </table>

        <h2>Bookings</h2>
        <table class="table table-striped">
            <thead class="thead-light">
                <tr>
                    <th>Booking ID</th>
                    <th>Service Type</th>
                    <th>Service Name</th>
                    <th>Location</th>
                    <th>Customer ID</th>
                    <th>Professional ID</th>
                    <th>Transaction Amount</th>
                    <th>Transaction Status</th>
                    <th>Ratings</th>
                    <th>Reviews</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
                <template v-for="booking in transaction.bookings" :key="booking.id">
                
                        <td>{{ booking.id }}</td>
                        <td>{{ booking.service?.type }}</td>
                        <td>{{ booking.service?.name }}</td>
                        <td>{{ booking.location }}</td>
                        <td>{{ transaction.customer_id }}</td>
                        <td>{{ transaction.professional_id }}</td>
                        <td>{{ transaction.amount }}</td>
                        <td>{{ transaction.status }}</td>
                        <td>{{ booking.rating }}</td>
                        <td>{{ booking.remarks }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <div class="container mt-4">
        <h2>List of Customers</h2>
        <table class="table table-striped">
            <thead class="thead-light">
                <tr>
                    <th>Customer ID</th>
                    <th>Customer Name</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="customer in customers" :key="customer.user_id">
                    <td>{{ customer.user_id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.location }}</td>
                </tr>
            </tbody>
        </table>

        <h2> List of Professionals</h2>
        <table class="table table-striped">
            <thead class="thead-light">
                <tr>
                    <th>Professional ID</th>
                    <th>Professional Name</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="professional in professionals" :key="professional.user_id">
                    <td>{{ professional.user_id }}</td>
                    <td>{{ professional.name }}</td>
                    <td>{{ professional.location }}</td>
                </tr>
            </tbody>
        </table>
        
        
    </div>
    `,
    data() {
        return {
            customers: [],
            professionals: [],
            schedules: [],
            transactions: [],
        };
    },
    methods: {
        async fetchAdminData() {
            try {
                const response = await fetch('/api/admin/bookings');
                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
                }
                const data = await response.json();
                this.customers = data.customers || [];
                this.professionals = data.professionals || [];
                this.schedules = data.schedules || [];
                this.transactions = data.transactions || [];
                


                console.log('transactions:', this.transactions[0]);
                console.log('admin data:', data);
                
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        },
        printPage() {
            window.print();
        },
   
    },
    async created() {
        await this.fetchAdminData();
    }
};