<script lang="ts">
  import { isAuthenticated, requireAuth } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  
  /** @type {{redirectTo?: string, children: Snippet}} */
  let props = $props();
  
  // Check authentication on mount
  onMount(() => {
    requireAuth(props.redirectTo || '/login');
  });
</script>

{#if isAuthenticated}
  {@render props.children()}
{/if}