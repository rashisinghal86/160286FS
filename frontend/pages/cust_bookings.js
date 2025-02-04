export default {
    name: 'CustBookings',
    template: `
      <div>
        <h2 class="display-1">Customer Bookings</h2>
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
              <p class="datetime">{{ formatDateTime(transaction.datetime) }}</p>
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
                    <th v-if="booking.rating !== null">Rating</th>
                    <th v-if="booking.rating !== null">Remarks</th>
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
                    <td v-if="booking.transaction.status === 'Completed'">
                      <div v-if="booking.rating === null">
                        <form @submit.prevent="rateBooking(booking.id)">
                          <td>
                            <input type="number" v-model="booking.ratingInput" placeholder="Rate: 5 for best" min="1" max="5">
                          </td>
                          <td>
                            <input type="text" v-model="booking.remarksInput" placeholder="Remarks">
                          </td>
                          <td>
                            <button class="btn btn-primary">
                              <i class="fas fa-star"></i>
                              Rate
                            </button>
                          </td>
                        </form>
                      </div>
                      <div v-else>
                        <td>{{ booking.rating }}</td>
                        <td>{{ booking.remarks }}</td>
                      </div>
                    </td>
                    <td>
                      <form @submit.prevent="completeBooking(booking.id)">
                        <button class="btn btn-success">
                          <i class="fas fa-check"></i>
                          Mark Complete
                        </button>
                      </form>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="alert alert-info">
            <strong>Info!</strong> No bookings found
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        transactions: [] // This will be populated with data from the server
      };
    },
    methods: {
      printPage() {
        window.print();
      },
      formatDateTime(datetime) {
        // Implement a method to format the datetime as needed
        return new Date(datetime).toLocaleString();
      },
      rateBooking(bookingId) {
        // Implement the logic to rate a booking
        // You can access the rating and remarks from the respective booking object
      },
      completeBooking(bookingId) {
        // Implement the logic to mark a booking as complete
      }
    },
    mounted() {
      // Fetch the transactions data from the server when the component is mounted
      fetch('/api/transactions')
        .then(response => response.json())
        .then(data => {
          this.transactions = data;
        });
    }
  };
  