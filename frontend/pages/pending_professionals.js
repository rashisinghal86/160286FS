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

      <div class="container mt-5">
        <h2>Approved Professionals</h2>
        <h6>Total Approved Professionals = {{ approvedProfessionals.length }}</h6>
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
            <tr v-for="professional in approvedProfessionals" :key="professional.id">
              <td>{{ professional.name }}</td>
              <td>{{ professional.location }}</td>
              <td>{{ professional.service_type }}</td>
              <td>
                <a :href="'/uploads/' + professional.filename" target="_blank">View Document</a>
              </td>
              <td>
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

      <div class="container mt-5">
        <h2>Blocked Professionals</h2>
        <h6>Total Blocked Professionals = {{ blockedProfessionals.length }}</h6>
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
            <tr v-for="professional in blockedProfessionals" :key="professional.id">
              <td>{{ professional.name }}</td>
              <td>{{ professional.location }}</td>
              <td>{{ professional.service_type }}</td>
              <td>
                <a :href="'/uploads/' + professional.filename" target="_blank">View Document</a>
              </td>
              <td>
                <button
                  @click="unblockProfessional(professional.id)"
                  class="btn btn-warning btn-sm"
                >
                  <i class="fa-solid fa-circle-check"></i> Unblock
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
      pendingProfessionals: [],
      approvedProfessionals: [],
      blockedProfessionals: []
    };
  },

  methods: {
    async fetchProfessionals() {
      try {
        const response = await fetch('/api/admin/pending_professionals');
        if (!response.ok) throw new Error('Failed to fetch professionals');

        const data = await response.json();
        this.pendingProfessionals = data.pending_professionals;
        this.approvedProfessionals = data.approved_professionals;
        this.blockedProfessionals = data.blocked_professionals;
      } catch (error) {
        console.error(error);
      }
    },

    async approveProfessional(id) {
      try {
        const response = await fetch(`/api/admin/approve_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) this.fetchProfessionals();
      } catch (error) {
        console.error(error);
      }
    },

    async blockProfessional(id) {
      try {
        const response = await fetch(`/api/admin/block_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) this.fetchProfessionals();
      } catch (error) {
        console.error(error);
      }
    },

    async unblockProfessional(id) {
      try {
        const response = await fetch(`/api/admin/unblock_professional/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) this.fetchProfessionals();
      } catch (error) {
        console.error(error);
      }
    },

    printPage() {
      window.print();
    }
  },

  mounted() {
    this.fetchProfessionals();
  }
};
