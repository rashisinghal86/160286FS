export default {
  template:`
  <div class="container mt-4">
      <h1 class="display-4">Admin dashboard</h1>
      <div class="profile-pic">
          <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Webmaster" width="100" alt="avatar">
      </div>
      <h3 class="text-muted">Welcome, Webmaster {{ admin.name }} </h3>
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
      <h2 class="display-4" style="text-align: center; font-weight: bold;">Graphical Overview:</h2>
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
          email: null,
          password: null,
          output: null,
          admin: { name: 'Admin' },
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
          ]
      };
  },
  
  methods: {     
    async submitlogin() {
          try {
              const response = await fetch(location.origin+'/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: this.email, password: this.password })
              });
              if (response.ok) {
                  console.log('login success');
                  const data = await response.json();
                  this.output = data;
                  console.log(data);
                  window.alert(data.email);
                //   this.$router.push('/api/category')
              }
          } catch (error) {
              console.error('Login failed', error);
          }
      },
        csv_export() {
            fetch ('/api/export')
            .then(response => response.json())
            .then(data => {
                window.location.href= `/api/csv_result/${data.id}`

                    });
                }
            }
        }