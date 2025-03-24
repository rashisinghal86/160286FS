export default {
    template: `
        <div class="container mt-1">
            <h1 class="display-1">Welcome {{ professional.name }}</h1>
            

            <form @submit.prevent="uploadDocument">
                <input type="file" @change="handleFileUpload" required>
                <button type="submit" class="btn btn-primary">Upload Document</button>
            </form>
            <h2 class="display-4">Your account is under verification</h2>
            <h5>Wait for Admin Approval.</h5>
            <a href="/signout" class="btn btn-danger btn-lg">EXIT</a>
        </div>
    `,
    data() {
        return {
            professional: { name: 'Professional Name' }, // Replace dynamically
            file: null
        };
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

            try {
                const response = await fetch('/api/upload_professional_file', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                alert(result.message);
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    }
};
