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
                    <tr v-for="schedule in schedules" :key="schedule.id" v-if="schedule.is_active || schedule.is_pending">
                        <td>{{ schedule.id }}</td>
                        <td>{{ schedule.service.name }}</td>
                        <td>{{ schedule.service.price }}</td>
                        <td>{{ schedule.location }}</td>
                        <td>{{ schedule.schedule_datetime }}</td>
                        <td>
                            <form @submit.prevent="confirmSchedule(schedule.id)">
                                <button class="btn btn-success">
                                    <i class="fas fa-check"></i> Accept
                                </button>
                            </form>
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
                const response = await fetch(`/confirm/${id}`, {
                    method: 'POST'
                });
                if (response.ok) {
                    alert("Schedule confirmed successfully!");
                    this.fetchSchedules(); // Refresh data after confirmation
                } else {
                    console.error("Failed to confirm schedule");
                }
            } catch (error) {
                console.error("Error confirming schedule:", error);
            }
        }
    },
    mounted() {
        this.fetchSchedules();
    }
};
