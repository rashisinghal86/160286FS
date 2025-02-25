// src/components/ProfileWrapper.js

import profile_admin from '../pages/profile_admin.js';
import profile_prof from '../pages/profile_prof.js';
import profile_cust from '../pages/profile_cust.js';

export default {
  data() {
    return {
      userProfile: null,
      error: null,
    };
  },
  components: {
    profile_admin,
    profile_prof,
    profile_cust,
  },
  async created() {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      this.userProfile = data;
    } catch (err) {
      this.error = err.message;
    }
  },
  computed: {
    profileComponent() {
      if (!this.userProfile) return null;
      switch (this.userProfile.role) {
        case 'Admin':
          return 'profile_admin';
        case 'Professional':
          return 'profile_prof';
        case 'Customer':
          return 'profile_cust';
        default:
          return null;
      }
    },
  },
  template: `
    <div>
      <nav-bar></nav-bar>
      <div v-if="error">{{ error }}</div>
      <component :is="profileComponent" v-else-if="profileComponent"></component>
      <div v-else>Loading...</div>
    </div>
  `,
};
