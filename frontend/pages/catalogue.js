export default {
    template:`
    
  <div>
    <h1 class="display-4 text-center">Catalogue of Services</h1>
    <br />
    <!-- Include the SearchBar component -->
    <SearchBar
      v-model:cname="cname"
      v-model:sname="sname"
      v-model:price="price"
      v-model:location="location"
    />
    <hr />
    <div class="container mt-4">
      <div style="text-align: right;">
        <router-link to="/professionals" class="btn btn-secondary">
          <i class="fa-solid fa-user-tie"></i> View Registered Professionals with us.
        </router-link>
      </div>
      <br />
      <div class="categories-list">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
        >
          <h2
            style="background-color: lightblue; padding: 10px; border-radius: 5px; text-transform: uppercase;"
          >
            <i class="fa fa-align-center" aria-hidden="true"></i>
            {{ category.name }}
          </h2>
          <div class="services">
            <div
              v-for="service in category.services"
              :key="service.id"
              v-if="serviceMatchesFilters(service)"
              class="card"
              style="width: 15rem; margin: 10px;"
            >
              <img />
              <div
                class="card-body"
                style="background-color: bisque; padding: 15px; border-radius: 5px;"
              >
                <h5 class="card-title">{{ service.name }}</h5>
                <p class="card-text">
                  <div class="description">
                    <strong>Description:</strong>
                    {{ service.description }}
                  </div>
                  <div class="location">
                    <strong>Location:</strong>
                    {{ service.location }}
                  </div>
                  <div class="price">
                    <strong>Price:</strong>
                    ₹ {{ service.price }}
                  </div>
                </p>
                <div
                  class="schedule_datetime"
                  style="padding: 15px; text-align: center;"
                >
                  <form
                    @submit.prevent="addToSchedule(service.id, scheduleDatetime, service.location)"
                    class="form"
                  >
                    <input
                      type="datetime-local"
                      v-model="scheduleDatetime"
                      class="form-control"
                    />
                    <br />
                    <input
                      type="submit"
                      value="Schedule Services"
                      class="btn btn-success"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


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