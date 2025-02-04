export default {
    template:`
  
    <div class="container mt-4">
      <h1 class="display-4">Admin Dashboard</h1>
      <div class="profile-pic">
        <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Webmaster" width="100" alt="avatar">
      </div>
      <h3 class="text-muted">Welcome, Webmaster {{ adminName }}</h3>
      <hr>
      <h4>What would you like to do?</h4>
      <div class="row justify-content-center align-items-center">
        <!-- Repeat this block for each card -->
        <div class="col-md-2 mb-2" v-for="action in actions" :key="action.title">
          <div class="card" style="width: 100%;">
            <div class="card-body">
              <h5 class="card-title text-center">{{ action.title }}</h5>
              <a :href="action.link" class="btn btn-success">
                <i :class="action.icon"></i>
                <img :src="action.imgSrc" class="card-img-top" alt="avatar">
                <p class="card-text">{{ action.description }}</p>
              </a>
            </div>
          </div>
        </div>
        <!-- End of card block -->
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
  

  <script>
  export default {
    data() {
      return {
        adminName: '', // This will be populated with actual data
        actions: [
          {
            title: 'My Profile',
            link: '/profile',
            icon: 'fa-solid fa-id-card fa-4x',
            imgSrc: 'https://api.dicebear.com/9.x/initials/svg?seed=Profile',
            description: 'Click here to update your profile',
          },
          // Add other actions similarly
        ],
        charts: [
          {
            id: 'myChart1',
            title: 'Services Summary',
          },
          {
            id: 'myChart2',
            title: 'Professional Status Summary',
          },
          {
            id: 'myChart3',
            title: 'Client Status Summary',
          },
        ],
      };
    },
    mounted() {
      // Fetch data for adminName, actions, and charts if needed
      // Initialize charts using Chart.js
    },
  };
  </script>

  <style>
  .chart-container {
    display: grid;
    justify-content: space-evenly;
    margin: 20px;
  }
  .btn {
    margin-top: 20px;
  }
  .display-4 {
    text-size-adjust: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  .profile-pic {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>

    `
    ,
    data() {
        return {
            email : null,
            password : null,
            output : null,
        }
    },
 methods: { 
     async submitlogin() {
        // we should use try&catch block to handle errors 
        const response = await fetch(location.origin+'/login', {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 email: this.email,
                 password: this.password
             })
         });
         
    if (response.ok) {
        console.log('login success');
        const data = await response.json();
        this.output = data;
        console.log(data);
        window.alert(data.email);
    }
}
 }
}  