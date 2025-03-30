export default {
    template: `
        <div class="container mt-1">
            <h1 class="display-1">Welcome {{ professionalName }}</h1>

            <form @submit.prevent="uploadDocument">
                <input type="file" @change="handleFileUpload" required>
                <button type="submit" class="btn btn-primary">Upload Document</button>
            </form>

            <h2 class="display-4">Your account is under verification</h2>
            <h5>Wait for Admin Approval.</h5>

            <router-link :to="exitRoute" class="btn btn-danger btn-lg">EXIT</router-link>        
        </div>
    `,
    data() {
        return {
            professionalName: 'Loading...', // Placeholder for professional's name
            file: null,
            email: localStorage.getItem("email"), // Fetching email from localStorage
            uploadSuccess: false // Track if the upload was successful
        };
    },
    computed: {
        exitRoute() {
            // Redirect to /homecss if upload is successful
            return this.uploadSuccess ? '/homecss' : '#';
        }
    },
    methods: {
        handleFileUpload(event) {
            this.file = event.target.files[0];
        },
        async uploadDocument() {
            if (!this.file) {
                alert("Please select a file to upload.");
                return;
            }

            let formData = new FormData();
            formData.append('file', this.file);
            formData.append('email', this.email); // Sending email to backend

            try {
                const response = await fetch('/api/upload_professional_file', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (response.ok) {
                    this.uploadSuccess = true; // Mark upload as successful
                    alert(result.message || "File uploaded successfully!");
                } else {
                    alert(result.error || "Failed to upload file.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
                alert("An error occurred while uploading the file.");
            }
        }
    },
    mounted() {
        // Fetch professional's name from localStorage or set a default value
        const storedName = localStorage.getItem("professionalName");
        this.professionalName = storedName || "Professional";
    }
};
