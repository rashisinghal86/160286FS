export default {
  template: `
    <div class="container mt-5">
      <div class="container mt-4">
        <h2 class="display-4">Search Professionals</h2>
        <hr>
        
        <form @submit.prevent="search">
          <div class="input-group mb-3">
            <input type="text" v-model="pname" class="form-control" placeholder="Name">
            <input type="text" v-model="plocation" class="form-control" placeholder="Location">
            <input type="text" v-model="pservice_type" class="form-control" placeholder="Service">
            <button @click="refreshPage" class="btn btn-outline-success">
              <i class="fa fa-refresh"></i> Refresh
            </button>
            <button class="btn btn-outline-primary" type="submit">
              <i class="fa fa-search"></i> Search
            </button>
          </div>
        </form>
        
        <hr>
        <h5 class="display-5 text-center mt-5">Search from all Registered Professionals</h5>

        <div class="professionals-list">
          <div class="container mt-5">
            <table class="table table-striped mt-3">
              <thead class="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Service Type</th>
                  <th>Document</th>
                  <th>Actions</th>
                  <th>Delete USER</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="professional in professionals" :key="professional.id">
                  <td>{{ professional.name }}</td>
                  <td>{{ professional.location }}</td>
                  <td>{{ professional.service_type }}</td>
                  <td>
                    <a :href="'/static/uploads/' + professional.filename" target="_blank">View Document</a>
                  </td>
                  <td>

                    <button  v-if="!professional.is_verified" @click="approveProfessional(professional.id)" class="btn btn-success rounded-pill btn-sm">
                      <i class="fa-solid fa-thumbs-up"></i> Approve
                    </button>
                    <button v-if="professional.is_verified && !professional.is_flagged " @click="blockProfessional(professional.id)" class="btn btn-danger rounded-pill btn-sm">
                      <i class="fa-solid fa-thumbs-down"></i> Block
                    </button>
                    <button v-if="professional.is_flagged" @click="unblockProfessional(professional.id)" class="btn btn-secondary rounded-pill btn-sm">
                      <i class="fa-solid fa-thumbs-up"></i> Unblock
                    </button>
                  </td>
                   <td>
                    <button @click="delete_user(professional.id)" class="btn btn-primary rounded-pill btn-sm">
  <i class="fa-solid fa-user-slash"></i> Delete
</button>

                  </td> 
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      professionals: []
    };
  },
  methods: {
    async fetchProfessionals() {
      try {
        const response = await fetch('/api/admin/professionals');
        if (!response.ok) throw new Error('Failed to fetch professionals');

        const data = await response.json();
        this.professionals = data.professionals;
      } catch (error) {
        console.error('Error fetching professionals:', error);
      }
    },
    async approveProfessional(id) {
      try {
        const response = await fetch(`/api/admin/approve_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
          
        });

        if (response.ok){
          window.alert('Professional approved successfully!');
          this.fetchProfessionals();
        } else {
            const errorData = await response.json();
            window.alert(`Approval failed: ${errorData.message || 'Unknown error'}`);
          }
        
      } catch (error) {
        console.error('Error approving professional:', error);
      }
    },
    async blockProfessional(id) {
      try {
        const response = await fetch(`/api/admin/block_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok){
          window.alert('Professional blocked successfully!');
         
          this.fetchProfessionals();
        }
      } catch (error) {
        console.error('Error blocking professional:', error);
      }
    },
    async unblockProfessional(id) {
      try {
        const response = await fetch(`/api/admin/unblock_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok){
          window.alert('Professional unblocked successfully!');
          this.fetchProfessionals();
        } 
      } catch (error) {
        console.error('Error unblocking professional:', error);
      }
    },
    async delete_user(id) {
      try {
        const response = await fetch(`/api/admin/delete_professional/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
    
        if (response.ok) {
          window.alert('Professional deleted successfully!');
          this.fetchProfessionals(); // Refresh the list after deletion
        } else {
          const errorData = await response.json();
          window.alert(`Deletion failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting professional:', error);
        window.alert('An error occurred while deleting the professional.');
      }
    }
      },
  mounted() {
    this.fetchProfessionals();
  }

};