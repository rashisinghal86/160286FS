export default {
    template: `
      <div class="container mt-4">
          <div class="row">
              <div class="col-md-6">
                  <h1 class="display-4">
                      Hello <span class="text-muted">@user.username</span>
                  </h1>
                  <div class="profile-pic">
                      <img :src="'https://api.dicebear.com/9.x/bottts/svg?seed=' + user.username" width="100" alt="">
                  </div>
                  <div class="container mt-4">
                      <p>Do you really want to delete your account?</p>
                      <p>This action is irreversible. Think Twice</p>
                      <button @click="deleteAccount" class="btn btn-dark btn-lg">
                          <i class="fa-solid fa-skull-crossbones"></i> Delete my account permanently
                      </button>
                  </div>
              </div>
              <div class="col-md-6">
                  <h2>Edit Profile</h2>
                  <form @submit.prevent="updateProfile" class="form mt-4">
                      <div class="form-group">
                          <label for="email" class="form-label">Email</label>
                          <input type="email" id="email" v-model="customer.email" class='form-control'>
                      </div>
                      <div class="form-group">
                          <label for="name" class="form-label">Name</label>
                          <input type="text" id="name" v-model="customer.name" class='form-control'>
                      </div>
                      <div class="form-group">
                          <label for="username" class="form-label">Username<span class="text-danger">**</span></label>
                          <input type="text" id="username" v-model="user.username" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label for="cpassword" class="form-label">Current Password<span class="text-danger">**</span></label>
                          <input type='password' id="cpassword" v-model="cpassword" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label for="password" class="form-label">New Password<span class="text-danger">**</span></label>
                          <input type='password' id="password" v-model="password" class="form-control" required>
                      </div>
                      <div class="form-group">
                          <label for="contact" class="form-label">Contact</label>
                          <input type="text" id="contact" v-model="customer.contact" class='form-control'>
                      </div>
                      <div class="form-group">
                          <label for="location" class="form-label">Location</label>
                          <input type="text" id="location" v-model="customer.location" class='form-control'>
                      </div>
                      <br>
                      <div class="form-group">
                          <input type="submit" value="Update" class="btn btn-primary">
                      </div>
                  </form>
              </div>
          </div>
      </div>
    `,
    data() {
      return {
        user: { username: "" },
        customer: { email: "", name: "", contact: "", location: "" },
        cpassword: "",
        password: ""
      };
    },
    methods: {
        async fetchUserData() {
            const response = await fetch('/api/users');
            if (response.ok) {
                this.user = await response.json();
            }
        },
      async updateProfile() {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: this.user.username,
                name: this.user.name,
                
                cpassword: this.cpassword,
                password: this.password,
                email: this.customer.email,
                contact: this.customer.contact,
                location: this.customer.location
            })
        });
        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile');
        }
    },
        async deleteAccount() {
            if (!confirm("Are you sure you want to delete your account? This action is irreversible!")) {
                return; // Stop if the user cancels
            }

            try {
                const response = await fetch('/api/delete/cust', { method: 'DELETE' });
                if (response.ok) {
                    alert("Your account has been deleted.");
                    window.location.href = '/home'; // Redirect to login page
                }
                else {
                    alert("Failed to delete account. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            }
        }
        },
        mounted() {
            this.fetchUserData();
        }
    };


