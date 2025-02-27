export default {
    template: `
      <div>
        <div class="container mt-4">
          <h2 class="display-4">
            Services offered in <strong>[[ category.name ]]</strong> Service_Type
          </h2>
          <hr>
          <div class="container mt-1"></div>
          <div class="heading text-center">
            <h2 class="display-5">Click here to add more services</h2>
            <router-link :to="{ name: 'AddService', params: { category_id: category.id } }" class="btn btn-success">
              <i class="fa5 fa-plus"></i>
              Add Services
            </router-link>
          </div>
          
          <h5 class="display-5 text-center mt-5">List of Authorized Services</h5>
          <table class="table table-striped mt-3">
            <thead>
              <tr>
                <th style="width: 10%">Service ID</th>
                <th style="width: 15%">Service Name</th>
                <th style="width: 10%">Service Type</th>
                <th style="width: 40%; text-align:center;">Description</th>
                <th style="width: 10%">Price (Base Price)</th>
                <th style="width: 15%">Management Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in services" :key="service.id">
                <td>[[ service.id ]]</td>
                <td>[[ service.name ]]</td>
                <td>[[ service.type ]]</td>
                <td>[[ service.description ]]</td>
                <td>[[ service.price ]]</td>
                <td>
                  <button @click="openEditModal(service)" class="btn btn-primary">
                    <i class="fas fa-edit"></i> Edit Service
                  </button>
                  <button @click="deleteService(service.id)" class="btn btn-danger">
                    <i class="fas fa-trash-can"></i> Delete Service
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- EDIT FORM MODAL -->
        <div v-if="editMode" class="modal-overlay">
          <div class="modal-content">
            <h2>Edit Service</h2>
            <form @submit.prevent="updateService">
              <div class="mb-3">
                <label for="editName" class="form-label">Service Name:</label>
                <input v-model="editService.name" type="text" id="editName" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="editType" class="form-label">Service Type:</label>
                <input v-model="editService.type" type="text" id="editType" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Description:</label>
                <textarea v-model="editService.description" id="editDescription" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="editPrice" class="form-label">Price:</label>
                <input v-model="editService.price" type="number" id="editPrice" class="form-control" required>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-save"></i> Save Changes
                </button>
                <button type="button" class="btn btn-secondary" @click="closeEditModal">
                  <i class="fas fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,
  
    data() {
      return {
        category: {},
        services: [],
        editMode: false,
        editService: {},
      };
    },
  
    methods: {
      async fetchCategory() {
        const categoryId = this.$route.params.category_id;
        try {
          const response = await fetch(`/api/category/${categoryId}`);
          if (response.ok) {
            this.category = await response.json();
            this.services = this.category.services;
          } else {
            console.error('Failed to fetch category:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      openEditModal(service) {
        this.editService = { ...service };
        this.editMode = true;
      },
  
      async updateService() {
        try {
          const response = await fetch(`/api/service/${this.editService.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.editService),
          });
          if (response.ok) {
            this.fetchCategory();
            this.closeEditModal();
          } else {
            console.error('Failed to update service:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      async deleteService(serviceId) {
        try {
          const response = await fetch(`/api/service/${serviceId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            this.fetchCategory();
          } else {
            console.error('Failed to delete service:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      closeEditModal() {
        this.editMode = false;
        this.editService = {};
      },
    },
  
    mounted() {
      this.fetchCategory();
    },
  };
  