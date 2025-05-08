<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { loginSchema } from '$lib/api/schemas/auth';
  
  // Define props with runes
  let { 
    data,
    action = '?/login',
    onSuccess = () => {},
    onError = () => {}
  } = $props<{
    data: any;
    action?: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }>();

  // Initialize the form using Svelte 5 runes
  let loading = $state(false);
  let error = $state<string | null>(null);

  const { form, errors, enhance, submitting } = superForm(data.form, {
    validators: zod(loginSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        error = null;
        onSuccess();
      }
    },
    onError: ({ result }) => {
      if ('error' in result && result.error && 'message' in result.error) {
        error = result.error.message || 'Login failed';
      } else {
        error = 'Login failed';
      }
      onError(result);
    }
  });
</script>

{#if error}
  <div class="alert alert-error">
    {error}
  </div>
{/if}

<form method="POST" action="{action}" use:enhance>
  <div class="form-group">
    <label for="identifier" class="label">
      <span class="label-text">Email or Username</span>
      <input 
        type="text" 
        id="identifier"
        name="identifier"
        class="input"
        class:input-error={$errors.identifier}
        bind:value={$form.identifier}
        autocomplete="username"
      />
    </label>
    {#if $errors.identifier}
      <span class="error-text">{$errors.identifier}</span>
    {/if}
  </div>

  <div class="form-group">
    <label for="password" class="label">
      <span class="label-text">Password</span>
      <input 
        type="password"
        id="password" 
        name="password"
        class="input"
        class:input-error={$errors.password}
        bind:value={$form.password}
        autocomplete="current-password"
      />
    </label>
    {#if $errors.password}
      <span class="error-text">{$errors.password}</span>
    {/if}
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting}>
      {#if $submitting}
        Logging in...
      {:else}
        Log In
      {/if}
    </button>
  </div>
</form>