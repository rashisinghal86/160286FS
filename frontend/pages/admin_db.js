export default {
  template: `
    <div class="container mt-4">
        <h1 class="display-4">Admin Dashboard</h1>
        <div class="profile-pic">
            <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Webmaster" width="100" alt="avatar">
        </div>
        <h3 class="text-muted">Welcome, Webmaster {{ admin.username }}</h3>
        <div class="row">
            <div class="text-end">
                <button @click="csv_export" class="btn btn-secondary">Download CSV</button>
            </div>
        </div>
        <hr>
        <h4>What would you like to do?</h4>
        <div class="row justify-content-center align-items-center">
            <div class="col-md-2 mb-2" v-for="item in menuItems" :key="item.title">
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ item.title }}</h5>
                        <router-link :to="item.link" class="btn btn-success">
                            <i :class="item.icon"></i>
                            <img :src="item.img" class="card-img-top" alt="avatar">
                            <p class="card-text">{{ item.description }}</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <h2 class="display-4 text-center font-weight-bold">Graphical Overview:</h2>
        <div class="chart-container mt-4">
            <div class="row">
                <div class="col-md-4 mb-4" v-for="chart in charts" :key="chart.id">
                    <h3>{{ chart.title }}</h3>
                    <canvas :id="chart.id" width="600" height="600"></canvas>
                </div>
            </div>
        </div>
    </div>
  `,
  data() {
    return {
      admin: {}, // Admin details
      menuItems: [
        { title: 'My Profile', link: '/profile_admin', icon: 'fa-solid fa-id-card fa-4x', img: 'https://api.dicebear.com/9.x/initials/svg?seed=Profile', description: 'Click here to update your profile' },
        { title: 'Service Management', link: '/categories', icon: 'fa-brands fa-buffer fa-5x', img: 'https://api.dicebear.com/9.x/initials/svg?seed=Service Management', description: 'Click here to add category of services' },
        { title: 'Professional Management', link: '/pending_professionals', icon: 'fa-solid fa-user-tie fa-5x', img: 'https://api.dicebear.com/9.x/initials/svg?seed=Professionals Management', description: 'Click here to verify professionals' },
        { title: 'Customer Management', link: '/manage_customers', icon: 'fa-solid fa-users fa-5x', img: 'https://api.dicebear.com/9.x/initials/svg?seed=Client Management', description: 'Click here to monitor customers' },
        { title: 'Overview', link: '/admin_booking', icon: 'fa-solid fa-file-invoice fa-5x', img: 'https://api.dicebear.com/9.x/initials/svg?seed=Overview', description: 'Click here to monitor all activities' }
      ],
      charts: [
        { id: 'myChart1', title: 'Services Summary' },
        { id: 'myChart2', title: 'Professional Status Summary' },
        { id: 'myChart3', title: 'Client Status Summary' }
      ],
      categoryData: [], // Data for services summary
      professionalCounts: {}, // Data for professional status summary
      customerCounts: {} // Data for client status summary
    };
  },
  mounted() {
    this.fetchData(); // Fetch data when the component is mounted
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('/api/admin_db');
        if (!response.ok) throw new Error('Failed to fetch admin data');
        const data = await response.json();

        // Update admin details
        this.admin = data.admin;

        // Update chart data
        this.categoryData = data.categories;
        this.professionalCounts = data.professional_counts;
        this.customerCounts = data.customer_counts;

        // Render charts
        this.renderCharts();
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    },
    renderCharts() {
      // Render Services Summary Chart
      const ctx1 = document.getElementById('myChart1');
      if (ctx1) {
        new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: this.categoryData.map(c => c.name),
            datasets: [{
              label: 'No. of services in each category',
              data: this.categoryData.map(c => c.service_count),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderWidth: 1
            }]
          },
          options: { scales: { y: { beginAtZero: true } } }
        });
      }

      // Render Professional Status Summary Chart
      const ctx2 = document.getElementById('myChart2');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'bar',
          data: {
            labels: ['Pending', 'Blocked', 'Approved'],
            datasets: [{
              label: 'No. of professionals',
              data: [this.professionalCounts.pending, this.professionalCounts.blocked, this.professionalCounts.approved],
              backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56'],
              borderWidth: 1
            }]
          },
          options: { scales: { y: { beginAtZero: true } } }
        });
      }

      // Render Client Status Summary Chart
      const ctx3 = document.getElementById('myChart3');
      if (ctx3) {
        new Chart(ctx3, {
          type: 'bar',
          data: {
            labels: ['Blocked', 'Unblocked'],
            datasets: [{
              label: 'No. of customers',
              data: [this.customerCounts.blocked, this.customerCounts.unblocked],
              backgroundColor: ['#36A2EB', '#FF6384'],
              borderWidth: 1
            }]
          },
          options: { scales: { y: { beginAtZero: true } } }
        });
      }
    },
    csv_export() {
      fetch('/api/export')
        .then(response => response.json())
        .then(data => {
          window.location.href = `/api/csv_result/${data.id}`;
        });
    }
  }
};
