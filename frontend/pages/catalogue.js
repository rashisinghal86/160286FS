export default {
  template: `
    <div class="container mt-4">
      <h1 class="display-4 text-center">Catalogue of Services</h1>
      <br>
      <div class="container mt-1">
        <form @submit.prevent="fetchCatalogue" class="form-inline">
          <div class="form-group mb-2">
            <input v-model="filters.cname" type="text" placeholder="Category Name" class="form-control">
          </div>
          <div class="form-group mx-sm-3 mb-2">
            <input v-model="filters.sname" type="text" placeholder="Service Name" class="form-control">
          </div>
          <div class="form-group mx-sm-3 mb-2">
            <input v-model="filters.price" type="number" placeholder="Max Price" class="form-control">
          </div>
          <div class="form-group mx-sm-3 mb-2">
            <input v-model="filters.location" type="text" placeholder="Location" class="form-control">
          </div>
          <button type="submit" class="btn btn-primary mb-2">Filter</button>
        </form>
      </div>
      <hr>
      <div class="container mt-4">
        <div style="text-align: right;">
          <router-link to="#" class="btn btn-secondary"> <i class="fa-solid fa-user-tie"></i> View Registered Professionals</router-link>
        </div>
        <br>
        <div class="categories-list">
          <div v-for="category in categories" :key="category.id" class="category">
            <h2 style="background-color: lightblue; padding: 10px; border-radius: 5px; text-transform: uppercase;">
              <i class="fa fa-align-center"></i> {{ category.name }}
            </h2>
            <div class="services d-flex flex-row flex-wrap justify-content-start">
              <div v-for="service in category.services" :key="service.id" class="card" style="width: 18rem; margin: 10px; background-color: bisque; border-radius: 5px;">
                <div class="card-body">
                  <h5 class="card-title">{{ service.name }}</h5>
                  <p class="card-text">
                    <strong>Description:</strong> {{ service.description }} <br>
                    <strong>Location:</strong> {{ service.location }} <br>
                    <strong>Price:</strong> &#8377; {{ service.price }}
                  </p>
                </div>
                <div class="schedule_datetime text-center p-3">
                  <form @submit.prevent="scheduleService(service.id, service.location)" class="form">
                    <input v-model="bookingDateTime[service.id]" type="datetime-local" class="form-control mb-2">
                    <button type="submit" class="btn btn-success">Schedule Service</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  data() {
    return {
      categories: [],
      filters: {
        cname: '',
        sname: '',
        price: '',
        location: ''
      },
      bookingDateTime: {}
    };
  },
  
  methods: {
    async fetchCatalogue() {
      try {
        const response = await fetch(`/api/catalogue?${new URLSearchParams(this.filters)}`);
        if (response.ok) {
          const data = await response.json();
          this.categories = data.categories;
        } else {
          console.error('Failed to fetch catalogue:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    
    async scheduleService(serviceId, location) {
      const datetime = this.bookingDateTime[serviceId];
      if (!datetime) {
        alert('Please select a date and time for booking.');
        return;
      }

      try {
        const response = await fetch(`/api/schedule/${serviceId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ datetime, location })
        });
        if (response.ok) {
          alert('Service scheduled successfully');
        } else {
          console.error('Failed to schedule service:');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  },
  
  mounted() {
    this.fetchCatalogue();
  }
};
