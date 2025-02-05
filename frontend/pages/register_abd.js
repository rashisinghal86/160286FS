export default {
    template: `
      <div>
        <h1>Welcome Admin</h1>   
        <p>Enter your name to register as an admin</p>
  
        <form @submit.prevent="registerAdmin" class="form">
          <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input type="text" v-model="name" required class="form-control">
          </div>
          <br>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Profile Upload</button>
          </div>
        </form>
      </div>
    `,
    data() {
      return {
        name: ""
      };
    },
    methods: {
      async registerAdmin() {
        try {
          const response = await fetch("/register_adb", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: this.name })
          });
  
          if (response.ok) {
            const data = await response.json();
            alert("Admin registered successfully!");
            console.log(data);
          } else {
            alert("Registration failed.");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };
  