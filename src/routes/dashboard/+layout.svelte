<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authStore } from '$lib/services/auth-service';
  import { initializeBackbone } from '$lib/services/wp-backbone-service';
  import Header from '$lib/components/dashboard/header.svelte';
  import Sidebar from '$lib/components/dashboard/sidebar.svelte';
  import Footer from '$lib/components/dashboard/footer.svelte';

  // Initialize Backbone.js and check authentication
  onMount(async () => {
    // Skip initialization during SSR
    if (browser) {
      // Initialize Backbone.js
      initializeBackbone();
      
      // Check if user is authenticated
      if (!$authStore.isAuthenticated) {
        const isAuthenticated = await authStore.checkAuth();
        
        // If still not authenticated, redirect to login
        if (!isAuthenticated) {
          goto('/login?redirect=/dashboard');
        }
      }
    }
  });
</script>

<div class="dashboard-layout">
  <Header />
  
  <div class="dashboard-content">
    <Sidebar />
    
    <main class="main-content">
      <slot />
    </main>
  </div>
  
  <Footer />
</div>

<style>
  .dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .dashboard-content {
    display: flex;
    flex: 1;
    margin-top: 4rem; /* Space for header */
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    margin-left: 250px; /* Width of sidebar */
    overflow-y: auto;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 60px; /* Width of collapsed sidebar */
      padding: 1rem;
    }
  }
</style>