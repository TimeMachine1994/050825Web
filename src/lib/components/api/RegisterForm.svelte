<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { registerSchema } from '$lib/api/schemas/auth';
  
  // Define props with runes
  let { 
    data,
    action = '?/register',
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
    validators: zod(registerSchema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        error = null;
        onSuccess();
      }
    },
    onError: ({ result }) => {
      if ('error' in result && result.error && 'message' in result.error) {
        error = result.error.message || 'Registration failed';
      } else {
        error = 'Registration failed';
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
    <label for="username" class="label">
      <span class="label-text">Username</span>
      <input 
        type="text" 
        id="username"
        name="username"
        class="input"
        class:input-error={$errors.username}
        bind:value={$form.username}
        autocomplete="username"
      />
    </label>
    {#if $errors.username}
      <span class="error-text">{$errors.username}</span>
    {/if}
  </div>

  <div class="form-group">
    <label for="email" class="label">
      <span class="label-text">Email</span>
      <input 
        type="email" 
        id="email"
        name="email"
        class="input"
        class:input-error={$errors.email}
        bind:value={$form.email}
        autocomplete="email"
      />
    </label>
    {#if $errors.email}
      <span class="error-text">{$errors.email}</span>
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
        autocomplete="new-password"
      />
    </label>
    {#if $errors.password}
      <span class="error-text">{$errors.password}</span>
    {/if}
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting}>
      {#if $submitting}
        Registering...
      {:else}
        Register
      {/if}
    </button>
  </div>
</form>