export default {
    template: `
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1>Rate Booking</h1>
                <form @submit.prevent="submitRating">
                    <div class="form-group">
                        <label for="rating">Rating</label>
                        <input type="number" class="form-control" id="rating" v-model="rating" min="1" max="5" required>
                    </div>
                    <div class="form-group">
                        <label for="comment">Comment</label>
                        <textarea class="form-control" id="comment" v-model="comment" rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            rating: null,
            comment: '',
            bookingId: null // Replace this with the actual booking ID if needed
        };
    },
    methods: {
        async submitRating() {
            try {
                const response = await fetch('/rate_booking/' + this.bookingId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        rating: this.rating,
                        comment: this.comment
                    })
                });

                if (response.ok) {
                    alert("Rating submitted successfully!");
                    this.rating = null;
                    this.comment = '';
                } else {
                    alert("Failed to submit rating.");
                }
            } catch (error) {
                console.error("Error submitting rating:", error);
                alert("An error occurred while submitting your rating.");
            }
        }
    }
};
