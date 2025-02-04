export default {
    template: `
    <div class="container mt-4">
        <h1 class="display-4">View Rating & Reviews of Listed Professional</h1>
        <hr>
        
        <h2>Rating & Reviews of Professionals</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Professional ID</th>
                    <th>Ratings</th>
                    <th>Reviews</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="transaction in transactions" :key="transaction.id">
                    <template v-for="booking in transaction.bookings" :key="booking.id">
                        <tr>
                            <td>{{ booking.service.name }}</td>
                            <td>{{ transaction.professional_id }}</td>
                            <td>{{ booking.rating }}</td>
                            <td>{{ booking.remarks }}</td>
                        </tr>
                    </template>
                </tr>
            </tbody>
        </table>
        
        <h2>All Listed Professionals</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Professional ID</th>
                    <th>Professional Name</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="professional in professionals" :key="professional.id">
                    <td>{{ professional.id }}</td>
                    <td>{{ professional.name }}</td>
                    <td>{{ professional.location }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            transactions: [],
            professionals: []
        };
    },
    async created() {
        try {
            const transactionsResponse = await fetch('/api/transactions');
            const professionalsResponse = await fetch('/api/professionals');
            
            if (transactionsResponse.ok) {
                this.transactions = await transactionsResponse.json();
            }
            if (professionalsResponse.ok) {
                this.professionals = await professionalsResponse.json();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
