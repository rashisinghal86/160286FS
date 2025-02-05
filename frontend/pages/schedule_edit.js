export default {
    template: `
    <div>
        <h2 class="mt-4">Edit Schedule</h2>

        <form @submit.prevent="updateSchedule">
            <h1>{{ schedule.id }}</h1>
            <div class="form-group">
                <label for="schedule_datetime" class="form-label">Schedule Datetime:</label>
                <input type="datetime-local"
                       v-model="schedule.schedule_datetime"
                       id="schedule_datetime"
                       class="form-control"
                       required>
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-edit fa-2x"></i> Update
                </button>
            </div>
        </form>
        
        <table>
            <thead>
                <tr>
                    <th>Schedule</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ schedule.id }}</td>
                    <td>{{ schedule.schedule_datetime }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            schedule: {
                id: null,
                schedule_datetime: null
            }
        };
    },
    created() {
        // Fetch schedule details from API when component is created
        this.fetchSchedule();
    },
    methods: {
        async fetchSchedule() {
            try {
                const response = await fetch(`/api/schedule/${this.$route.params.id}`);
                if (response.ok) {
                    this.schedule = await response.json();
                } else {
                    console.error("Failed to fetch schedule");
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        },
        async updateSchedule() {
            try {
                const response = await fetch(`/api/schedule/${this.schedule.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ schedule_datetime: this.schedule.schedule_datetime })
                });

                if (response.ok) {
                    alert("Schedule updated successfully!");
                } else {
                    console.error("Failed to update schedule");
                }
            } catch (error) {
                console.error("Error updating schedule:", error);
            }
        }
    }
};
