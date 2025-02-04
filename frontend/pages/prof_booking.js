export default {
    template: `
    <div>
        <h2 class="display-1">Professional Bookings</h2>
        <hr>
        <div v-if="transactions.length > 0">
            <div v-for="transaction in transactions" :key="transaction.id" class="heading">
                <h2 class="text-muted">Transaction # {{ transaction.id }}</h2>
                <p class="datetime">{{ formatDate(transaction.datetime) }}</p>
                <div class="bookings">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Service Name</th>
                                <th>Date of Completion</th>
                                <th>Location</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="booking in transaction.bookings" :key="booking.id">
                                <td>{{ booking.id }}</td>
                                <td>{{ booking.service.name }}</td>
                                <td>{{ booking.date_of_completion }}</td>
                                <td>{{ booking.location }}</td>
                                <td>{{ booking.transaction.amount }}</td>
                                <td>{{ booking.transaction.status }}</td>
                                <td>
                                    <input type="hidden" name="rating" placeholder="enter rating">
                                </td>
                                <td>
                                    <input type="hidden" name="remarks" placeholder="enter remarks">    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-info">
            <strong>Info!</strong> No Appointments found
        </div>
    </div>
    `,
    data() {
        return {
            transactions: [] // Replace with actual data fetch
        };
    },
    methods: {
        formatDate(datetime) {
            if (!datetime) return '';
            const date = new Date(datetime);
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    },
    mounted() {
        console.log('Professional Bookings Component Loaded');
        // Fetch transactions data here
    }
};
