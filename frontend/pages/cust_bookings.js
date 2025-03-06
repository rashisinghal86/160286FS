export default {
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
                              <th v-if="hasRatings(transaction.bookings)">Rating</th>
                              <th v-if="hasRatings(transaction.bookings)">Remarks</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="booking in transaction.bookings" :key="booking.id">
                              <td>{{ booking.id }}</td>
                              <td>{{ booking.service.name }}</td>
                              <td>{{ booking.date_of_completion }}</td>
                              <td>{{ booking.location }}</td>
                              <td>{{ transaction.amount }}</td>
                              <td>{{ transaction.status }}</td>
                              <td v-if="transaction.status === 'Completed'">
                                  <template v-if="booking.rating == null">
                                      <input type="number" v-model="booking.newRating" placeholder="Rate: 5 for best" min="1" max="5">
                                  </template>
                                  <template v-else>
                                      {{ booking.rating }}
                                  </template>
                              </td>
                              <td v-if="transaction.status === 'Completed'">
                                  <template v-if="booking.rating == null">
                                      <input type="text" v-model="booking.newRemarks" placeholder="Remarks">
                                      <button class="btn btn-primary" @click="rateBooking(booking.id, booking.newRating, booking.newRemarks)">
                                          <i class="fas fa-star"></i> Rate
                                      </button>
                                  </template>
                                  <template v-else>
                                      {{ booking.remarks }}
                                  </template>
                              </td>
                              <td v-if="transaction.status !== 'Completed'">
                                  <button class="btn btn-success" @click="markComplete(booking.id)">
                                      <i class="fas fa-check"></i> Mark Complete
                                  </button>
                              </td>
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
          transactions: []
      };
  },
  methods: {
      async fetchBookings() {
          try {
              const response = await fetch('/api/bookings');
              if (response.ok) {
                  const data = await response.json();
                  console.log("API Response:", data); // Debugging
                  this.transactions = data.transactions;
                  console.log("Transactions:", this.transactions); // Debugging
              } else {
                  console.error("Failed to fetch bookings");
              }
          } catch (error) {
              console.error("Error fetching bookings:", error);
          }
      },
      async rateBooking(id, rating, remarks) {
          try {
              const response = await fetch(`/api/booking/rate/${id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ rating, remarks })
              });
              if (response.ok) {
                  this.fetchBookings();
              } else {
                  console.error("Failed to rate booking");
              }
          } catch (error) {
              console.error("Error rating booking:", error);
          }
      },
      async markComplete(id) {
          try {
              const response = await fetch(`/api/booking/complete/${id}`, { method: 'POST' });
              if (response.ok) {
                  this.fetchBookings();
              } else {
                  console.error("Failed to mark booking complete");
              }
          } catch (error) {
              console.error("Error marking booking complete:", error);
          }
      },
      printPage() {
          window.print();
      },
      formatDate(date) {
          return new Date(date).toLocaleString();
      },
      hasRatings(bookings) {
          return bookings.some(b => b.rating !== null);
      }
  },
  mounted() {
      this.fetchBookings();
  }
}
