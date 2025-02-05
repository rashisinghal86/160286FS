export default {
    template: `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <form @submit.prevent="submitForm">
                    <div class="input-group">
                        <input type="text" 
                        name="cname"
                        id="cname"
                        v-model="cname"
                        class="form-control"
                        placeholder="Category">

                        <input type="text"
                        name="sname"
                        id="sname"
                        v-model="sname"
                        class="form-control"
                        placeholder="Service Type">

                        <input type="text"
                        name="location"
                        id="location"
                        v-model="location"
                        class="form-control"
                        placeholder="Location">

                        <a :href="clearUrl" class="btn btn-outline-info">
                            <i class="fa fa-trash"></i>
                            Clear
                        </a>
                        <button class="btn btn-outline-primary" type="submit">
                            <i class="fa fa-search"></i>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cname: '',
            sname: '',
            location: '',
            clearUrl: '/catalogue' // Adjust this to your actual route
        };
    },
    methods: {
        submitForm() {
            console.log("Search submitted with:", this.cname, this.sname, this.location);
            // Perform the necessary search operation or API call here
        }
    }
}
