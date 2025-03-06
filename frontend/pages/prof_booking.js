export default {
    template: `
    <div>
        <h2 class="display-1">Professional Bookings</h2>
        <button class="btn btn-primary" @click="printPage" style="float: right;">
          <i class="fas fa-print" aria-hidden="true"></i>
          Print
      </button>
        <hr>
        <div v-if="transactions.length > 0">
            <div v-for="transaction in transactions" :key="transaction.id" class="heading">
                <h2 class="text-muted">Transaction # {{ transaction.id }}</h2>
                <p class="datetime">{{ formatDate(transaction.datetime) }}</p>
                <pre>{{ transactions }}</pre>

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
            transactions: []
        };
    },
    methods: {
        async fetchBookings() {
            try {
                const response = await fetch("/api/bookings");
                if (!response.ok) throw new Error("Failed to fetch bookings");
        
                const data = await response.json();
                console.log("API Response:", data);
        
                // Ensure transactions exist before assigning
                if (data.transactions) {
                    console.log("Transactions found:", data.transactions);
                    this.transactions = data.transactions;
                } else {
                    console.log("No transactions found in the response");
                    this.transactions = [];
                }
                console.log("Transactions after assignment:", this.transactions);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        },
         printPage() {
            window.print();
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
            }
    },        

    mounted() {
        this.fetchBookings();
    }
}
