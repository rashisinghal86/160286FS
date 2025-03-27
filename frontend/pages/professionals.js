export default {
  template: `
    <div class="container mt-5">
      <div class="container mt-4">
        <h2 class="display-4">Search Professionals</h2>
        <br>

        <searchbar2></searchbar2>
        <br>
        <a href="/pending_professionals" class="btn btn-primary">
          <i class="fa fa-angle-left"></i>
          Back
        </a>
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

                    <button  v-if="!professional.is_verified" @click="approveProfessional(professional.id)" class="btn btn-success btn-sm">
                      <i class="fa-solid fa-thumbs-up"></i> Approve
                    </button>
                    <button v-if="professional.is_verified" @click="blockProfessional(professional.id)" class="btn btn-danger btn-sm">
                      <i class="fa-solid fa-thumbs-down"></i> Block
                    </button>
                    <button v-if="professional.is_flagged" @click="unblockProfessional(professional.id)" class="btn btn-secondary btn-sm">
                      <i class="fa-solid fa-thumbs-up"></i> Unblock
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
    }
  },
  mounted() {
    this.fetchProfessionals();
  }
};