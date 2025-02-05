export default {
    template: `
        <h1 class="display-1">  
        <a href="/catalogue" class="btn btn-success">
            <i class="fa-solid fa-book-open"></i>
                <p class="card-text">view catalogue</p>
        </a>
        Requested Schedule Details </h1>
        
        <hr>
        
        <table class="table">
            <thead>
                <tr>
                    <th>Schedule</th>
                    <th>Service</th>
                    <th>Price</th>
                    <th>Location</th>
                    <th>Scheduled_date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in schedules" :key="schedule.id">
                    <td>{{ schedule.id }}</td>
                    <td>{{ schedule.service.name }}</td>
                    <td>{{ schedule.service.price }}</td>
                    <td>{{ schedule.service.location }}</td>
                    <td>{{ schedule.schedule_datetime }}</td>
                    <td>
                        <form :action="'/edit_schedule/' + schedule.id">
                            <button class="btn btn-success">
                                <i class="fas fa-check"></i>
                                Edit Schedule
                            </button>
                        </form>
                    </td>
                    <td>
                        <form :action="'/delete_schedule/' + schedule.id" method="post">
                            <button class="btn btn-danger">
                                <i class="fas fa-trash"></i>
                                Delete Schedule
                            </button>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <div v-if="schedules.length === 0" class="alert alert-warning">
            <h4 class="alert-heading">No schedule found</h4>
            <p>There is no schedule found in the database. Please add a schedule to proceed.</p>
            <a href="/catalogue" class="btn btn-outline-primary"> Check catalogue to schedule services</a>
        </div>
    `,
    data() {
        return {
            schedules: []
        }
    },
    mounted() {
        fetch('/api/schedules')
            .then(response => response.json())
            .then(data => this.schedules = data);
    }
}
