export default {
    template: `
      <div class="container mt-4">
        <h1 class="display-1">
          Hello <span class="text-muted">@{{ service.name }}</span>
        </h1>
      </div>
    `,
    
    data() {
      return {
        service: {}
      };
    },
  
    async mounted() {
      // Fetch the service details from API (Update the endpoint accordingly)
      try {
        const response = await fetch('/api/service'); 
        if (response.ok) {
          this.service = await response.json();
        } else {
          console.error('Failed to fetch service:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  