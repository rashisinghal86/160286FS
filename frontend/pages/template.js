export default {
    template:`
    <div>
    <div class="container mt-4">
    <h2 class="display-5">
        Household Services Application - PLATFORM
    </h2>
    <div class="home">
        <img src="https://api.dicebear.com/9.x/bottts/svg?seed=Platform" width="100" alt="avatar">


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