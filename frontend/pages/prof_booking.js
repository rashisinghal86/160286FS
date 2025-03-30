export default {
    template: `
    <div>
        <h2 class="display-1">Professional Bookings</h2>
        <button class="btn btn-primary" @click="printPage" style="float: right;">
            <i class="fas fa-print" aria-hidden="true"></i>  
            Print
        </button>
        <br>
        <hr>
        <div v-if="transactions.length > 0">
            <div v-for="transaction in transactions" :key="transaction.id">
                <div class="heading">
                  <h2 class="text-muted">Transaction # {{ transaction.id }}</h2>
                  <p class="datetime">{{ formatDate(transaction.datetime) }}</p>
                </div>
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
                                <td>{{ booking.service_name }}</td>
                                <td>{{ formatDate(booking.date_of_completion) }}</td>
                                <td>{{ booking.location }}</td>
                                <td>{{ transaction.amount }}</td>
                                <td>{{ transaction.status }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-info">
            <strong>Info!</strong> No bookings found
        </div>
    </div>
    `,
    data() {
        return {
            transactions: [] // Holds the transactions fetched from the backend
        };
    },
    methods: {
        async fetchBookings() {
            try {
                const response = await fetch("/api/prof/transactions", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
  
                if (response.ok) {
                    const data = await response.json();
                    console.log("API Response:", data); // Debugging
                    if (data.transactions && data.transactions.length > 0) {
                        this.transactions = data.transactions;
                    } else {
                        console.log("No transactions found in the response");
                        this.transactions = [];
                    }
                } else {
                    const errorData = await response.json();
                    console.error("Failed to fetch bookings:", errorData.error || "Unknown error");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        },
        printPage() {
            window.print();
        },
        formatDate(date) {
            return date ? new Date(date).toLocaleString() : "N/A";
        }
    },
    mounted() {
        this.fetchBookings();
    }
  };
  