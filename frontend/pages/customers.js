export default {
    template:`
          <div class="container mt-5">
            <div class="container mt-4">
              <h2 class="display-4">Search Customers</h2>
              <br>
              <!-- Include search bar component -->
              <SearchBar />
              <br>
              <router-link to="/manage-customers" class="btn btn-primary">
                <i class="fa fa-angle-left"></i>
                Back
              </router-link>
              <hr>
              <h5 class="display-5 text-center mt-5">Search from all Registered Customers</h5>
              <div class="customers-list">
                <div class="container mt-5">
                  <table class="table table-striped mt-3">
                    <thead class="thead-dark">
                      <tr>
                        <th style="width: 20%">Name</th>
                        <th style="width: 40%">Location</th>
                        <th style="width: 30%">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="customer in filteredCustomers" :key="customer.id">
                        <td>{{ customer.name }}</td>
                        <td>{{ customer.location }}</td>
                        <td>
                          <button @click="blockCustomer(customer.id)" class="btn btn-danger btn-sm">
                            <i class="fa-solid fa-circle-xmark"></i> Block
                          </button>
                          <button @click="unblockCustomer(customer.id)" class="btn btn-warning btn-sm">
                            <i class="fa-solid fa-circle-check"></i> Unblock
                          </button>
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