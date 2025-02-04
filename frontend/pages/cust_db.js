export default {
    name: 'CustomerDashboard',
    template: `
      <div class="container mt-4">
        <h1 class="display-4">Customer Dashboard</h1>
        <div class="profile-pic">
          <img :src="'https://api.dicebear.com/9.x/bottts/svg?seed=' + cust_name" width="100" alt="avatar">
        </div>
        <h3 class="text-muted">Welcome, {{ cust_name }}</h3>
        <hr>
        <h4>What would you like to do?</h4>
        <div class="row justify-content-center align-items-center">
          <div class="col-md-2 mb-2" v-for="action in actions" :key="action.title">
            <div class="card" style="width: 100%;">
              <div class="card-body">
                <h5 class="card-title text-center">{{ action.title }}</h5>
                <router-link :to="action.route" class="btn btn-success">
                  <i :class="action.icon"></i>
                  <img :src="action.imgSrc" class="card-img-top" alt="avatar">
                  <p class="card-text">{{ action.description }}</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        cust_name: 'Customer Name', // Replace with actual data as needed
        actions: [
          {
            title: 'My Profile',
            route: '/profile',
            icon: 'fa-solid fa-id-card fa-4x',
            imgSrc: 'https://api.dicebear.com/9.x/initials/svg?seed=Profile',
            description: 'Edit Profile | Change Password',
          },
          {
            title: 'Catalogue',
            route: '/catalogue',
            icon: 'fa fa-book fa-5x',
            imgSrc: 'https://api.dicebear.com/9.x/initials/svg?seed=Catalogue',
            description: 'Click here to view catalogue of services',
          },
          {
            title: 'View My Schedules',
            route: '/schedule',
            icon: 'fa-brands fa-buffer fa-5x',
            imgSrc: 'https://api.dicebear.com/9.x/initials/svg?seed=Schedules',
            description: 'Take a look at your requested services',
          },
          {
            title: 'View My Bookings',
            route: '/bookings',
            icon: 'fa-sharp-duotone fa-solid fa-user-tie fa-5x',
            imgSrc: 'https://api.dicebear.com/9.x/initials/svg?seed=Bookings',
            description: 'Take a look at your confirmed booking',
          },
        ],
      };
    },
  };
  