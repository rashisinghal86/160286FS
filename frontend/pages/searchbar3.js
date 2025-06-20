export default {
    data() {
        return {
            cname: '',
            clocation: ''
        };
    },
    template: `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <form @submit.prevent="search">
                    <div class="input-group">
                        <input type="text" 
                        name="cname"
                        id="cname"
                        v-model="cname"
                        class="form-control"
                        placeholder="Name">

                        <input type="text"
                        name="clocation"
                        id="clocation"
                        v-model="clocation"
                        class="form-control"
                        placeholder="Location">
                        
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
    computed: {
        refreshUrl() {
            return '/customers';
        }
    },
    methods: {
        search() {
            console.log('Searching for:', this.cname, this.clocation);
            // You can implement actual API call here
        }
    }
};
