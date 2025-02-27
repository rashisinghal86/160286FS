export default {
  template: `
    <div class="container mt-4">
      <h4 class="display-3">  
        <a href="/catalogue" class="btn btn-success">
          <i class="fa-solid fa-book-open"></i>
          <p class="card-text">View Catalogue</p>
        </a>
        Requested Schedule Details
      </h4>
      <hr>
      <table class="table">
        <thead>
          <tr>
            <th>Schedule</th>
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
              <button @click="openEditModal(schedule)" class="btn btn-success">
                <i class="fas fa-check"></i> Edit Schedule
              </button>
            </td>
            <td>
              <button @click="deleteSchedule(schedule.id)" class="btn btn-danger">
                <i class="fas fa-trash"></i> Delete Schedule
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="schedules.length === 0" class="alert alert-warning">
        <h4 class="alert-heading">No schedule found</h4>
        <p>There is no schedule found in the database. Please add a schedule to proceed.</p>
        <a href="/catalogue" class="btn btn-outline-primary">Check Catalogue to Schedule Services</a>
      </div>

      <!-- Edit Schedule Modal -->
      <div v-if="showEditModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Schedule</h5>
              <button type="button" class="close" @click="closeEditModal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateSchedule">
                <div class="form-group">
                  <label for="schedule_datetime" class="form-label">Schedule Datetime:</label>
                  <input v-model="editScheduleData.schedule_datetime" type="datetime-local" id="schedule_datetime" class="form-control" required>
                </div>
                <div class="form-group mt-3">
                  <button type="submit" class="btn btn-success">
                    <i class="fas fa-edit"></i> Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      schedules: [],
      showEditModal: false,
      editScheduleData: {
        id: null,
        schedule_datetime: ''
      }
    };
  },
  methods: {
    async fetchSchedules() {
      try {
        const response = await fetch('/api/schedules');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched schedules:', data);  // Debugging log
          this.schedules = data;
        } else {
          console.error('Failed to fetch schedules:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    },
    openEditModal(schedule) {
      this.editScheduleData = { ...schedule };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    async updateSchedule() {
      try {
        const response = await fetch(`/api/schedule/edit/${this.editScheduleData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schedule_datetime: this.editScheduleData.schedule_datetime })
        });
        if (response.ok) {
          alert('Schedule updated successfully');
          this.closeEditModal();
          this.fetchSchedules();  // Refresh the list of schedules
        } else {
          console.error('Failed to update schedule:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating schedule:', error);
      }
    },
    async deleteSchedule(scheduleId) {
      try {
        const response = await fetch(`/api/schedule/delete/${scheduleId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Schedule deleted successfully');
          this.fetchSchedules();  // Refresh the list of schedules
        } else {
          console.error('Failed to delete schedule:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  },
  mounted() {
    this.fetchSchedules();
  }
};