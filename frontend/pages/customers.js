export default {
  template: `
    <div class="container mt-5">
      <div class="container mt-4">
        <h2 class="display-4">Search Customers</h2>
        <br>
        <!-- Search Bar -->
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <form @submit.prevent="search">
                <div class="input-group">
                  <input
                    type="text"
                    name="cname"
                    id="cname"
                    v-model="cname"
                    class="form-control"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="clocation"
                    id="clocation"
                    v-model="clocation"
                    class="form-control"
                    placeholder="Location"
                  />
                  <button @click="refreshPage" class="btn btn-outline-success">
                    <i class="fa fa-refresh"></i> Refresh
                  </button>
                  <button class="btn btn-outline-primary" type="submit">
                    <i class="fa fa-search"></i> Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <br>
        <hr>
        <h5 class="display-5 text-center mt-5">Search from all Registered Customers</h5>
        <div class="customers-list">
          <div class="container mt-5">
            <table class="table table-striped mt-3">
              <thead class="thead-dark">
                <tr>
                  <th style="width: 20%">Name</th>
                  <th style="width: 20%">Location</th>
                  <th style="width: 30%">Actions</th>
                  <th style="width: 20%">Delete USER</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id">
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.location }}</td>
                  <td>
                    <button
                      v-if="!customer.is_blocked"
                      @click="blockCustomer(customer.id)"
                      class="btn btn-danger btn-sm"
                    >
                      <i class="fa-solid fa-circle-xmark"></i> Block
                    </button>
                    <button
                      v-if="customer.is_blocked"
                      @click="unblockCustomer(customer.id)"
                      class="btn btn-warning btn-sm"
                    >
                      <i class="fa-solid fa-circle-check"></i> Unblock
                    </button>
                  </td>
                  <td>
                    <button
                      @click="delete_user(customer.id)"
                      class="btn btn-primary rounded-pill btn-sm"
                    >
                      <i class="fa-solid fa-user-slash"></i> Delete
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
      customers: [],
      cname: '', // Search by name
      clocation: '' // Search by location
    };
  },
  computed: {
    filteredCustomers() {
      // Filter customers based on search inputs
      return this.customers.filter(customer => {
        const matchesName = this.cname
          ? customer.name.toLowerCase().includes(this.cname.toLowerCase())
          : true;
        const matchesLocation = this.clocation
          ? customer.location.toLowerCase().includes(this.clocation.toLowerCase())
          : true;
        return matchesName && matchesLocation;
      });
    }
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
    search() {
      console.log('Searching for:', this.cname, this.clocation);
      // The computed property `filteredCustomers` will automatically update
    },
    refreshPage() {
      // Clear search inputs and reload customers
      this.cname = '';
      this.clocation = '';
      this.fetchCustomers();
    },
    async blockCustomer(id) {
      try {
        const response = await fetch(`/api/admin/block_customer/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          window.alert('Customer blocked successfully');
          this.fetchCustomers();
        }
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

        if (response.ok) {
          window.alert('Customer unblocked successfully');
          this.fetchCustomers();
        }
      } catch (error) {
        console.error('Error unblocking customer:', error);
      }
    },
    async delete_user(id) {
      try {
        const response = await fetch(`/api/admin/delete_customer/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          window.alert('Customer deleted successfully!');
          this.fetchCustomers(); // Refresh the list after deletion
        } else {
          const errorData = await response.json();
          window.alert(`Deletion failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting Customer:', error);
        window.alert('An error occurred while deleting the Customer.');
      }
    }
  },
  mounted() {
    this.fetchCustomers();
  }
};