export default {
    template: `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <form @submit.prevent="search">
                    <div class="input-group">
                        <input type="text" 
                        v-model="pname"
                        class="form-control"
                        placeholder="Name">

                        <input type="text"
                        v-model="plocation"
                        class="form-control"
                        placeholder="Location">

                        <input type="text"
                        v-model="pservice_type"
                        class="form-control"
                        placeholder="Service">
                        
                        <a :href="refreshUrl" class="btn btn-outline-success">
                            <i class="fa fa-refresh"></i>
                            Refresh
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
            pname: '',
            plocation: '',
            pservice_type: '',
            refreshUrl: '/professionals'
        };
    },
    methods: {
        search() {
            console.log("Searching with:", this.pname, this.plocation, this.pservice_type);
            // You can make an API call here
        }
    }
}
