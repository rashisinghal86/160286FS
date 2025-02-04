export default {
    template:`
    <div>
      <h1 class="display-1">
        Hello
        <span class="text-muted"> user.username </span>
      </h1>
      <div class="profile-pic">
        <img src="'https://api.dicebear.com/9.x/lorelei/svg?seed=' + userusername" width="100" alt="">
      </div>
      <a href="/signout" class="btn btn-outline-danger">Signout</a>
      <h5>

      <!-- Update profile functionality -->

      <!-- Form to create booking -->
      </h5>
      <form @submit.prevent="createBooking" class="form">
        <div class="card mt-4">
          <div class="card-header">
            service.name 's booking Details
          </div>
          <div class="card-body">
            <div class="row" v-for="(value, key) in professional" :key="key">
              <div class="col-sm-4 font-weight-bold">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</div>
              <div class="col-sm-8"> value</div>
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mt-4">Create Booking</button>
      </form>
    </div>

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