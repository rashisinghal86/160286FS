export default {
  template: `
    <div>
      <div class="container mt-4">
        <h2 class="display-4">
          Services offered in <strong>{{ category.name }}</strong> Service_Type
        </h2>
        <hr>
        <div class="container mt-1"></div>
        <div class="heading text-center">
          <h2 class="display-5">Click here to add more services</h2>
          <button class="btn btn-success" @click="openAddModal">
            <i class="fa5 fa-plus"></i>
            Add Service
          </button>
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
              <td>{{ service.id }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.type }}</td>
              <td>{{ service.description }}</td>
              <td>{{ service.price }}</td>
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

      <!-- ADD FORM MODAL -->
      <div v-if="addMode" class="modal-overlay">
        <div class="modal-content">
          <h2>Add Service</h2>
          <form @submit.prevent="addService">
            <div class="mb-3">
              <label for="serviceName" class="form-label">Service Name:</label>
              <input v-model="name" type="text" id="serviceName" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="serviceType" class="form-label">Service Type:</label>
              <input v-model="type" type="text" id="serviceType" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="serviceDescription" class="form-label">Description:</label>
              <textarea v-model="description" id="serviceDescription" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
              <label for="servicePrice" class="form-label">Price:</label>
              <input v-model="price" type="number" id="servicePrice" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="serviceLocation" class="form-label">Location:</label>
              <input v-model="location" type="text" id="serviceLocation" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="serviceDuration" class="form-label">Duration:</label>
              <input v-model="duration" type="text" id="serviceDuration" class="form-control" required>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-success">
                <i class="fas fa-save"></i> Add Service
              </button>
              <button type="button" class="btn btn-secondary" @click="closeAddModal">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
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
      name: '',
      type: '',
      description: '',
      price: '',
      location: '',
      duration: '',
      addMode: false,
      editMode: false,
      editService: {},
    };
  },

  methods: {
    async fetchCategory() {
      const categoryId = this.$route.params.categoryId;
      try {
        const response = await fetch(`/api/categories/${categoryId}/services`);
        if (response.ok) {
          const data = await response.json();
          this.category = data.category;
          this.services = data.services;
        } else {
          console.error('Failed to fetch category:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    openAddModal() {
      this.addMode = true;
    },

    closeAddModal() {
      this.addMode = false;
      this.name = '';
      this.type = '';
      this.description = '';
      this.price = '';
      this.location = '';
      this.duration = '';
    },

    async addService() {
      try {
        const response = await fetch(`/api/categories/${this.category.id}/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            type: this.type,
            description: this.description,
            price: this.price,
            location: this.location,
            duration: this.duration,
          }),
        });
        if (response.ok) {
          this.fetchCategory();
          this.closeAddModal();
        } else {
          console.error('Failed to add service:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    openEditModal(service) {
      this.editService = { ...service };
      this.editMode = true;
    },

    closeEditModal() {
      this.editMode = false;
      this.editService = {};
    },

    async updateService() {
      try {
        const response = await fetch(`/api/categories/${this.category.id}/services/${this.editService.id}`, {
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
        const response = await fetch(`/api/categories/${this.category.id}/services/${serviceId}`, {
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
  },

  mounted() {
    this.fetchCategory();
  },
};

// Add Styles
const style = document.createElement('style');
style.innerHTML = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}
`;
document.head.appendChild(style);
