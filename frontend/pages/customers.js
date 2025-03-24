export default {
  template: `
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
                <tr v-for="customer in customers" :key="customer.id">
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
      customers: []
    };
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await fetch('/api/admin/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');

        const data = await response.json();
        this.customers = data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async blockCustomer(id) {
      try {
        const response = await fetch(`/api/admin/block_customer/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) this.fetchCustomers();
        window.alert('Customer blocked successfully');
      } catch (error) {
        console.error('Error blocking customer:', error);
      }
    },
    async unblockCustomer(id) {
      try {
        const response = await fetch(`/api/admin/unblock_customer/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) this.fetchCustomers();
        window.alert('Customer unblocked successfully');
      } catch (error) {
        console.error('Error unblocking customer:', error);
      }
    }
  },
  mounted() {
    this.fetchCustomers();
  }
};