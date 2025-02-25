export default {
    template: `
      <div class="container mt-4">
        <h2 class="display-4">Manage ServiceCategory_Type</h2>
        <hr>
        
        <!-- ADD FORM -->
        <div class="container mt-1">
          <form @submit.prevent="addCategory" class="form">
            <div class="form-group text-center mt-3">
              <label for="name" class="form-label"></label>
              <input v-model="name" type="text" id="name" placeholder="Add ServiceCategory_Type Name Here" class="form-control" required>
              <button type="submit" class="btn btn-success">
                <i class="fa-solid fa-plus"></i> Add Type
              </button>
            </div>
          </form>
  
          <!-- CATEGORY LIST -->
          <h5 class="display-5 text-center mt-5">List of Authorized Service_Types</h5>
          <table class="table table-striped mt-3">
            <thead>
              <tr>
                <th style="width: 10%">ID</th>
                <th style="width: 15%">Service_Type</th>
                <th style="width: 15%">Services Offered</th>
                <th style="width: 60%; text-align:center;">Management Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.id">
                <td>[[ category.id ]]</td>
                <td>[[ category.name ]]</td>
                <td>[[ category.services.length ]]</td>
                <td>
                  <button @click="showCategoryDetails(category.id)" class="btn btn-primary">
                    <i class="fa-solid fa-magnifying-glass-plus"></i> Show Details
                  </button>
                  <button @click="openEditModal(category)" class="btn btn-warning">
                    <i class="fas fa-edit"></i> Edit Type
                  </button>
                  <button @click="deleteCategory(category.id)" class="btn btn-danger">
                    <i class="fa-regular fa-trash-can"></i> Delete Type
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- EDIT FORM MODAL -->
        <div v-if="editMode" class="modal-overlay">
          <div class="modal-content">
            <h2>Edit ServiceCategory_Type</h2>
            <form @submit.prevent="updateCategory">
              <div class="mb-3">
                <label for="editName" class="form-label">Update Category Name:</label>
                <input v-model="editName" type="text" id="editName" class="form-control" required>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-edit"></i> Update
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
        name: '',
        categories: [],
        editMode: false,
        editId: null,
        editName: '',
      };
    },
  
    methods: {
      async fetchCategories() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found in local storage');
            return;
          }
          const response = await fetch('/api/category', {
            method: 'GET',
            headers: {
              'Authentication-Token': token,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            this.categories = await response.json();
          } else {
            console.error('Failed to fetch categories:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      async addCategory() {
        try {
          const response = await fetch('/api/category', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.name })
          });
          if (response.ok) {
            this.name = '';
            this.fetchCategories();
          } else {
            console.error('Failed to add category');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      async deleteCategory(id) {
        try {
          const response = await fetch(`/api/category/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            this.fetchCategories();
          } else {
            console.error('Failed to delete category');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
  
      openEditModal(category) {
        this.editName = category.name;
        this.editId = category.id;
        this.editMode = true;
      },
  
      async updateCategory() {
        try {
          const response = await fetch(`/api/category/${this.editId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.editName })
          });
          if (response.ok) {
            this.closeEditModal();
            this.fetchCategories();
          } else {
            console.error('Failed to update category');
          }
        } catch (error) {
          console.error('Error updating category:', error);
        }
      },
  
      closeEditModal() {
        this.editMode = false;
        this.editId = null;
        this.editName = '';
      }
    },
  
    mounted() {
      this.fetchCategories();
    }
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
