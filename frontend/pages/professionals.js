export default {
    template:`
    <div class="container mt-5">
        <div class="container mt-4">
            <h2 class="display-4">Search Professionals</h2>
            <br>

            <searchbar2></searchbar2>
            <br>
            <a href="/pending_professionals" class="btn btn-primary">
                <i class="fa fa-angle-left"></i>
                Back
            </a>
            <hr>
            <h5 class="display-5 text-center mt-5">Search from all Registered Professionals </h5>

            <div class="professionals-list">
                <div class="container mt-5">
                    <table class="table table-striped mt-3">
                        <thead class="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Service Type</th>
                                <th>Document</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="professional in professionals" :key="professional.id">
                                <td>{{ professional.name }}</td>
                                <td>{{ professional.location }}</td>
                                <td>{{ professional.service_type }}</td>
                                <td>
                                    <a :href="'/static/uploads/' + professional.filename" target="_blank">View Document</a>
                                </td>
                                <td>
                                    <button @click="approveProfessional(professional.id)" class="btn btn-success btn-sm">
                                        <i class="fa-solid fa-thumbs-up"></i> Approve
                                    </button>
                                    <button @click="blockProfessional(professional.id)" class="btn btn-danger btn-sm">
                                        <i class="fa-solid fa-circle-xmark"></i> Block
                                    </button>
                                    <button @click="unblockProfessional(professional.id)" class="btn btn-warning btn-sm">
                                        <i class="fa-solid fa-circle-check"></i> Unblock
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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