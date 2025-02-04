export default {
    template:`
    <template>
  <div class="container mt-4 d-flex justify-content-center">
    <div class="card" style="width: 100%; max-width: 800px;">
      <div class="card-body" style="color:tomato">
        <h1 class="display-4 text-center">DELETE USER FROM PLATFORM!</h1>
        <p class="fs-5 text-center">Are you sure to remove Customer's/Professional's Account?</p>
        <form @submit.prevent="deleteUser">
          <div class="form-group">
            <label for="id" class="form-label">UniqueID</label>
            <input type="text" v-model="userId" required class="form-control">
          </div>
          <div class="form-group">
            <label for="location" class="form-label">Location</label>
            <input type="text" v-model="location" required class="form-control">
          </div>
          <br>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-danger">Delete User Permanently</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteUser',
  data() {
    return {
      userId: '',
      location: '',
    };
  },
  methods: {
    async deleteUser() {
      try {
        const response = await fetch('/delete_user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.userId,
            location: this.location,
          }),
        });
        if (response.ok) {
          // Handle successful deletion (e.g., show a success message or redirect)
        } else {
          // Handle error response
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 50px;
}
.card {
  padding: 20px;
  border: 1px solid #ccc;
}
.form-group {
  margin-bottom: 15px;
}
</style>

    `
    ,
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