export default {
    name: 'ManageCustomers',
    template: `
      <div class="container mt-4">
        
        <router-link to="/customers" class="btn btn-outline-primary">
          <i class="fa fa-search"></i> Search Customers
        </router-link>
        <button class="btn btn-primary" @click="printPage" style="float: right;">
          <i class="fas fa-print" aria-hidden="true"></i> Print
        </button>
        <hr>
        <div class="container mt-5">
          <h2>Unblocked Customers</h2>
          <h6>Total Unblocked Customers = {{ unblockedCustomers.length }}</h6>
          <table class="table table-striped mt-3">
            <thead class="thead-dark">
              <tr>
                <th style="width: 10%">Name</th>
                <th style="width: 40%">Location</th>
                <th style="width: 5%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in unblockedCustomers" :key="customer.id">
                <td>{{ customer.name }}</td>
                <td>{{ customer.location }}</td>
                <td>
                  <button @click="blockCustomer(customer.id)" class="btn btn-danger btn-sm" style="font-size: 15px;">
                    <i class="fa-solid fa-circle-xmark"></i> Block
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="container mt-5">
          <h2>Blocked Customers</h2>
          <h6>Total Blocked Customers = {{ blockedCustomers.length }}</h6>
          <table class="table table-striped mt-3">
            <thead class="thead-dark">
              <tr>
                <th style="width: 10%">Name</th>
                <th style="width: 40%">Location</th>
                <th style="width: 5%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in blockedCustomers" :key="customer.id">
                <td>{{ customer.name }}</td>
                <td>{{ customer.location }}</td>
                <td>
                  <button @click="unblockCustomer(customer.id)" class="btn btn-warning btn-sm" style="font-size: 15px;">
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
        unblockedCustomers: [],
        blockedCustomers: [],
      };
    },
    methods: {
      printPage() {
        window.print();
      },
      async fetchCustomers() {
        try {
          const response = await fetch('/api/admin/manage_customers');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          this.unblockedCustomers = data.unblocked_customers;
          this.blockedCustomers = data.blocked_customers;
        } catch (error) {
          console.error('Error fetching customers:', error);
        }
      },
      async blockCustomer(customerId) {
        try {
          const response = await fetch(`/api/admin/block_customer/${customerId}`, {
            method: 'POST',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.fetchCustomers();
        } catch (error) {
          console.error('Error blocking customer:', error);
        }
      },
      async unblockCustomer(customerId) {
        try {
          const response = await fetch(`/api/admin/unblock_customer/${customerId}`, {
            method: 'POST',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          this.fetchCustomers();
        } catch (error) {
          console.error('Error unblocking customer:', error);
        }
      },
    },
    created() {
      this.fetchCustomers();
    },
};
