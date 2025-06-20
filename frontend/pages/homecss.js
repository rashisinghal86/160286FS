export default {
  template: `
    <div class="container mt-4">
      <h2 class="display-5">
        Household Services Application - PLATFORM
      </h2>
      <div class="home">
        <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Platform" width="100" alt="avatar">
      </div>
      <em class="text-muted">
        Welcome, The Household Services Application is a multi-user platform designed to offer comprehensive home servicing
        solutions.
        The application serves as a bridge connecting customers with verified service professionals, managed by an admin
        for efficient service delivery and fraud prevention.
        This is a simple application that allows professionals and customers to register and request for
        services respectively in the field of Interiors, Healthcare, Nutrition, Fitness, etc.
      </em>
      <hr>
      <h4>What would you like to do?</h4>

      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="card" style="width: 100%;">
            <div class="card-body d-flex flex-column align-items-center">
              <h5 class="card-title text-center">Login</h5>
              <router-link to="/api/login" class="btn btn-light stretched-link">
                <i class="fa-solid fa-sign-in-alt fa-10x" style="color: #007bff;"></i>
                <p class="card-text">Login as a Professional or Customer</p>
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-4">
          <div class="card" style="width: 100%;">
            <div class="card-body d-flex flex-column align-items-center">
              <h5 class="card-title text-center">Register</h5>
              <router-link to="/register" class="btn btn-light stretched-link">
                <i class="fa-solid fa-user-plus fa-10x"></i>
                <p class="card-text">New Users! click here</p>
              </router-link>
            </div>
          </div>
        </div>

        <div class="col-md-4 mb-3">
          <div class="card" style="width: 100%;">
            <div class="card-body d-flex flex-column align-items-center">
              <h5 class="card-title text-center">Explore</h5>
              <a href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" class="btn btn-light stretched-link" target="_blank">
                <i class="fab fa-youtube fa-10x" style="color: #ff0000;"></i>
                <p class="card-text">To Know more about us.</p>
              </a>
            </div>
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
    };
  },
  methods: {
    async submitlogin() {
      // we should use try&catch block to handle errors
      const response = await fetch(location.origin + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });

      if (response.ok) {
        console.log('login success');
        const data = await response.json();
        this.output = data;
        console.log(data);
        window.alert(data.email);
      }
    },
  },
};