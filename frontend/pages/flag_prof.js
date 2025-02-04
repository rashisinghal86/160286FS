export default {
    template:`
    <div class="container mt-1">
    <h1 class="display-1">Welcome  professional.name</h1>
    <h2 class="display-4">Your account is flagged</h2>
    <h5>You will be connected shortly!</h5>
    <a href="/signout" class="btn btn-danger btn-lg">EXIT</a>
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