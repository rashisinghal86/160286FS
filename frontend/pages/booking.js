export default {
    template:`
    <div>
      <h1 class="display-1">Service Bookings</h1>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Service Name</th>
            <th>Request Date</th>
            <th>Status</th>
            <th>Professional Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td>{{ booking.id }}</td>
            <td>{{ booking.category_name }}</td>
            <td>{{ booking.service_name }}</td>
            <td>{{ booking.date_of_booking }}</td>
            <td>
              <button v-if="booking.is_pending" class="btn btn-secondary">
                <i class="fas fa-clock"></i> Pending
              </button>
              <span v-else-if="booking.is_accepted">Active</span>
              <span v-else-if="booking.is_completed">Completed</span>
              <span v-else-if="booking.is_canceled">Canceled</span>
              <span v-else>Unknown</span>
            </td>
            <td>
              <span v-if="booking.professional_id">
                {{ booking.professional_id }}
              </span>
              <span v-else>Not Assigned</span>
            </td>
            <td>
              <button @click="removeBooking(booking.id)" class="btn btn-danger">
                <i class="fas fa-trash"></i> Remove
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5"><strong>Total Bookings:</strong></td>
            <td>{{ totalRequests }}</td>
            <td>
              <button @click="openCompletedBookings" class="btn btn-success">
                <i class="fas fa-check-circle"></i> OPEN &gt;&gt; Completed &gt;&gt; CLOSED
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    `
    ,
    data() {
        return {
            email : null,
            password : null,
            output : null,
        }
    },
 methods: { 
     async submitlogin() {
        // we should use try&catch block to handle errors 
        const response = await fetch(location.origin+'/login', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 email: this.email,
                 password: this.password
             })
         });
         
    if (response.ok) {
        console.log('login success');
        const data = await response.json();
        this.output = data;
        console.log(data);
        window.alert(data.email);
    }
}
 }
}  