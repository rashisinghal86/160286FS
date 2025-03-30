export default {
    template: `
    <div>
        <h1 class="display-1">Service Requests</h1>
        <hr>
        <div v-if="schedules.length > 0">
            <table class="table">
                <thead>
                    <tr>
                        <th>Appointment</th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Location</th>
                        <th>Scheduled Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="schedule in schedules" :key="schedule.id">
                        <td>{{ schedule.id }}</td>
                        <td>{{ schedule.service.name }}</td>
                        <td>{{ schedule.service.price }}</td>
                        <td>{{ schedule.location }}</td>
                        <td>{{ schedule.schedule_datetime }}</td>
                        <td>
                        <button class="btn btn-success" @click="confirmSchedule(schedule.id)">
                            <i class="fas fa-check"></i> Accept
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="alert alert-warning">
            <h4 class="alert-heading">No schedule found</h4>
            <p>There is no schedule found in the database. Please wait for Service Requests.</p>
        </div>
    </div>
    `,
    data() {
        return {
            schedules: [] // This should be populated with an API call
        };
    },
    methods: {
        async fetchSchedules() {
            try {
                const response = await fetch('/api/schedules'); // Adjust API endpoint as needed
                if (response.ok) {
                    this.schedules = await response.json();
                } else {
                    console.error("Failed to fetch schedules");
                }
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        },
        async confirmSchedule(id) {
            try {
                const response = await fetch(`/api/schedule/${id}/confirm`, { // Fixed dynamic URL
                    method: 'POST'
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to confirm schedule");
                }
        
                alert("Schedule confirmed successfully!");
                this.fetchSchedules();
                this.$router.push('/prof_booking');  // Refresh data after confirmation
            } catch (error) {
                console.error("Error confirming schedule:", error);
                alert(error.message);
            }
        }
    },        
    mounted() {
        this.fetchSchedules();
    }
};
