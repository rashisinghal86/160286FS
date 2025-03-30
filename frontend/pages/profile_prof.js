export default {
    template: `
      <div class="container mt-4">
        <div class="row">
          <!-- Profile details on the left -->
          <div class="col-md-6">
            <h1 class="display-4">
              Hello
              <span class="text-muted">@{{ professional.name }}</span>
            </h1>
  
            <div class="profile-pic">
              <img :src="'https://api.dicebear.com/9.x/bottts/svg?seed=' + professional.username" width="100" alt="avatar">
            </div>
            <div class="container mt-4">
              <p>Do you really want to delete your account?</p>
              <p>This action is irreversible. Think Twice</p>
              <button @click="deleteAccount" class="btn btn-dark btn-lg">
                <i class="fa-solid fa-skull-crossbones"></i> Delete my account permanently
              </button>
            </div>
          </div>
  
          <!-- Edit form on the right -->
          <div class="col-md-6">
            <h2>Edit Profile</h2>
            <form @submit.prevent="updateProfile" class="form mt-4">
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="professional.email" id="email" class="form-control">
              </div>
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" v-model="professional.name" id="name" class="form-control">
              </div>
              <div class="form-group">
                <label for="username" class="form-label">Username<span class="text-danger">**</span></label>
                <input type="text" v-model="professional.username" id="username" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="cpassword" class="form-label">Current Password<span class="text-danger">**</span></label>
                <input type="password" v-model="cpassword" id="cpassword" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="password" class="form-label">New Password<span class="text-danger">**</span></label>
                <input type="password" v-model="password" id="password" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="contact" class="form-label">Contact</label>
                <input type="text" v-model="professional.contact" id="contact" class="form-control">
              </div>
              <div class="form-group">
                <label for="experience" class="form-label">Experience</label>
                <input type="text" v-model="professional.experience" id="experience" class="form-control">
              </div>
              <div class="form-group">
                <label for="location" class="form-label">Location</label>
                <input type="text" v-model="professional.location" id="location" class="form-control">
              </div>
              <div class="form-group">
                <label for="service_type" class="form-label">Service Type</label>
                <input type="text" v-model="professional.service_type" id="service_type" class="form-control">
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
        professional: { email: "", name: "", username: "", contact: "", experience: "", location: "", service_type: "" },
        cpassword: "",
        password: ""
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.role === 'Professional') {
              this.professional.email = data.email;
              this.professional.name = data.name;
              this.professional.username = data.username;
              this.professional.contact = data.contact || "";
              this.professional.experience = data.experience || "";
              this.professional.location = data.location || "";
              this.professional.service_type = data.service_type || "";
            } else {
              alert("You are not authorized to access this page.");
              this.$router.push('/home');
            }
          } else {
            console.error("Failed to fetch professional data");
          }
        } catch (error) {
          console.error("Error fetching professional data:", error);
        }
      },
      async updateProfile() {
        try {
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.professional.email,
              name: this.professional.name,
              username: this.professional.username,
              cpassword: this.cpassword,
              password: this.password,
              contact: this.professional.contact,
              experience: this.professional.experience,
              location: this.professional.location,
              service_type: this.professional.service_type
            })
          });
          if (response.ok) {
            alert('Profile updated successfully!');
          } else {
            alert('Failed to update profile');
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("Something went wrong. Please try again.");
        }
      },
      async deleteAccount() {
        if (!confirm("Are you sure you want to delete your account? This action is irreversible!")) {
          return; // Stop if the user cancels
        }
  
        try {
          const response = await fetch('/api/delete/prof', { method: 'DELETE' });
          if (response.ok) {
            alert("Your account has been deleted.");
            this.$router.push('/home'); // Redirect to home page
          } else {
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