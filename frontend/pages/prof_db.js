export default {
    template: `
    <div class="container mt-4">
        <h1 class="display-4">Professional Dashboard</h1>
        <div class="profile-pic">
            <img :src="avatarUrl" width="100" alt="avatar">
        </div>
        <h3 class="text-muted">Welcome, {{ prof_name }} </h3>
        <hr>
        <h4>What would you like to do?</h4>
        <div class="row justify-content-center align-items-center">
            <div class="col-md-2 mb-2" v-for="(card, index) in cards" :key="index">
                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <h5 class="card-title">{{ card.title }}</h5>
                        <a :href="card.link" class="btn btn-success">
                            <i :class="card.icon"></i>
                            <img :src="card.img" class="card-img-top" alt="avatar">
                            <p class="card-text">{{ card.description }}</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            prof_name: "John Doe", // Replace with dynamic data if needed
            avatarUrl: `https://api.dicebear.com/9.x/bottts/svg?seed=JohnDoe`,
            cards: [
                {
                    title: "My Profile",
                    link: "/profile",
                    icon: "fa-solid fa-id-card fa-4x",
                    img: "https://api.dicebear.com/9.x/initials/svg?seed=Profile",
                    description: "Edit Profile | Change Password"
                },
                {
                    title: "View Upcoming Schedules",
                    link: "/pending_booking",
                    icon: "fa-brands fa-buffer fa-5x",
                    img: "https://api.dicebear.com/9.x/initials/svg?seed=Schedules",
                    description: "Take a look at your service requests"
                },
                {
                    title: "View My Bookings",
                    link: "/bookings",
                    icon: "fa-solid fa-user-tie fa-5x",
                    img: "https://api.dicebear.com/9.x/initials/svg?seed=Bookings",
                    description: "Take a look at your appointments"
                }
            ]
        };
    }
};
