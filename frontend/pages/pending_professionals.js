export default {
    template: `
    <div class="container mt-4">
      <h2 class="display-4">Professionals Management</h2>
      <hr>
      <div class="button-group">
        <router-link to="/admin_db" class="btn btn-primary">
          <i class="fa fa-angle-left"></i> Back
        </router-link>
        <router-link to="/professionals" class="btn btn-outline-primary">
          <i class="fa fa-search"></i> Search Professionals
        </router-link>
        <button class="btn btn-primary" @click="printPage" style="float: right;">
          <i class="fas fa-print" aria-hidden="true"></i> Print
        </button>
      </div>
      <hr />
      
      <div class="container mt-1">
        <h2>Pending Professionals</h2>
        <h6>Total Pending Professionals = {{ pendingProfessionals.length }}</h6>
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
            <tr v-for="professional in pendingProfessionals" :key="professional.id">
              <td>{{ professional.name }}</td>
              <td>{{ professional.location }}</td>
              <td>{{ professional.service_type }}</td>
              <td>
                <a :href="'/uploads/' + professional.filename" target="_blank">View Document</a>
              </td>
              <td>
                <button
                  @click="approveProfessional(professional.id)"
                  class="btn btn-success btn-sm"
                >
                  <i class="fa-solid fa-thumbs-up"></i> Approve
                </button>
                <button
                  @click="blockProfessional(professional.id)"
                  class="btn btn-danger btn-sm"
                >
                  <i class="fa-solid fa-circle-xmark"></i> Block
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    `,
    
    data() {
        return {
            email: null,
            password: null,
            output: null,
            pendingProfessionals: [] // Add this to prevent Vue from breaking
        };
    },

    methods: { 
        async fetchProfessionals() {
            try {
                const response = await fetch('/api/professionals');
                if (!response.ok) throw new Error('Failed to fetch professionals');
                const data = await response.json();
                this.pendingProfessionals = data.pending;
            } catch (error) {
                console.error(error);
            }
        },

        async approveProfessional(id) {
            try {
                const response = await fetch(`/api/professionals/${id}/approve`, { method: 'POST' });
                if (response.ok) this.fetchProfessionals();
            } catch (error) {
                console.error(error);
            }
        },

        async blockProfessional(id) {
            try {
                const response = await fetch(`/api/professionals/${id}/block`, { method: 'POST' });
                if (response.ok) this.fetchProfessionals();
            } catch (error) {
                console.error(error);
            }
        },

        printPage() {
            window.print();
        },

        async submitlogin() {
            try {
                const response = await fetch(location.origin + '/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.email, password: this.password })
                });
                
                if (response.ok) {
                    console.log('Login success');
                    const data = await response.json();
                    this.output = data;
                    window.alert(data.email);
                }
            } catch (error) {
                console.error('Login failed', error);
            }
        }
    },

    mounted() {
        this.fetchProfessionals(); // Fetch pending professionals when component loads
    }
};
