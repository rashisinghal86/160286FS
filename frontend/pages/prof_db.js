export default {
    template:`
    <div class="container mt-4">
        <h1 class="display-4">Professional Dashboard</h1>
        <div class="profile-pic">
            <img :src="'https://api.dicebear.com/9.x/bottts/svg?seed=' + email" width="100" alt="avatar">
        </div>
        <h3 class="text-muted">Welcome, {{ email }} </h3>
        <hr>
        <h4>What would you like to do?</h4>
        <div class="row justify-content-center align-items-center">
            <div class="col-md-2 mb-2" v-for="item in menuItems" :key="item.title">
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ item.title }}</h5>
                        <router-link :to="item.link" class="btn btn-success">
                            <i :class="item.icon"></i>
                            <img :src="'https://api.dicebear.com/9.x/initials/svg?seed=' + item.seed" class="card-img-top" alt="avatar">
                            <p class="card-text">{{ item.text }}</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,
            output: null,
            menuItems: [
                { title: 'My Profile', link: '/profile', icon: 'fa-solid fa-id-card fa-4x', seed: 'Profile', text: 'Edit Profile | Change Password' },
                { title: 'View Pending Bookings', link: '/view_appointments', icon: 'fa-brands fa-buffer fa-5x', seed: 'PendingBookings', text: 'Manage your pending service requests' },
                { title: 'View My Bookings', link: '/prof_booking', icon: 'fa-solid fa-user-tie fa-5x', seed: 'Bookings', text: 'Review your confirmed bookings' }
            ]
        }
    },
    methods: { 
        async submitlogin() {
            try {
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
                    console.log('Login success');
                    const data = await response.json();
                    this.output = data;
                    console.log(data);
                    window.alert(data.email);
                }
            } catch (error) {
                console.error('Login failed', error);
            }
        }
    }
  }
  