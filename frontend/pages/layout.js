export default {
    template:`
    <div>
      <header>
        <!-- Navbar Component -->
        <Navbar />
      </header>
      <main class="container">
        <!-- Slot for injecting page-specific content -->
        <slot></slot>
      </main>
      <footer>
        <br>
        <br>
        <marquee>Built exclusively for IIT Madras - Diploma in Data Science & Programming Pre-Requisite | 2024.</marquee>
      </footer>
    </div>
  `,
 
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