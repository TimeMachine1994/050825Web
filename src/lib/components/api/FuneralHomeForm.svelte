<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { createFuneralHomeSchema, updateFuneralHomeSchema } from '$lib/api/schemas/funeralHome';
  
  // Define props with runes
  let { 
    data,
    action = '?/saveFuneralHome',
    isEdit = false,
    onSuccess = () => {},
    onError = () => {}
  } = $props<{
    data: any;
    action?: string;
    isEdit?: boolean;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }>();

  // Use appropriate schema based on whether it's an edit or create operation
  const schema = isEdit ? updateFuneralHomeSchema : createFuneralHomeSchema;

  // Initialize the form using Svelte 5 runes
  let loading = $state(false);
  let error = $state<string | null>(null);

  const { form, errors, enhance, submitting } = superForm(data.form, {
    validators: zod(schema),
    onUpdated: ({ form }) => {
      if (form.valid) {
        error = null;
        onSuccess();
      }
    },
    onError: ({ result }) => {
      if ('error' in result && result.error && 'message' in result.error) {
        error = result.error.message || 'Failed to save funeral home';
      } else {
        error = 'Failed to save funeral home';
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
    <label for="name" class="label">
      <span class="label-text">Funeral Home Name*</span>
      <input 
        type="text" 
        id="name"
        name="name"
        class="input"
        class:input-error={$errors.name}
        bind:value={$form.name}
      />
    </label>
    {#if $errors.name}
      <span class="error-text">{$errors.name}</span>
    {/if}
  </div>

  <div class="form-group">
    <label for="address" class="label">
      <span class="label-text">Address*</span>
      <input 
        type="text" 
        id="address"
        name="address"
        class="input"
        class:input-error={$errors.address}
        bind:value={$form.address}
      />
    </label>
    {#if $errors.address}
      <span class="error-text">{$errors.address}</span>
    {/if}
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="form-group">
      <label for="city" class="label">
        <span class="label-text">City</span>
        <input 
          type="text" 
          id="city"
          name="city"
          class="input"
          class:input-error={$errors.city}
          bind:value={$form.city}
        />
      </label>
      {#if $errors.city}
        <span class="error-text">{$errors.city}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="state" class="label">
        <span class="label-text">State</span>
        <input 
          type="text" 
          id="state"
          name="state"
          class="input"
          class:input-error={$errors.state}
          bind:value={$form.state}
          maxlength="2"
        />
      </label>
      {#if $errors.state}
        <span class="error-text">{$errors.state}</span>
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div class="form-group">
      <label for="zipCode" class="label">
        <span class="label-text">ZIP Code</span>
        <input 
          type="text" 
          id="zipCode"
          name="zipCode"
          class="input"
          class:input-error={$errors.zipCode}
          bind:value={$form.zipCode}
          pattern="^\d{5}(-\d{4})?$"
        />
      </label>
      {#if $errors.zipCode}
        <span class="error-text">{$errors.zipCode}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="phoneNumber" class="label">
        <span class="label-text">Phone Number</span>
        <input 
          type="tel" 
          id="phoneNumber"
          name="phoneNumber"
          class="input"
          class:input-error={$errors.phoneNumber}
          bind:value={$form.phoneNumber}
          placeholder="(123) 456-7890"
        />
      </label>
      {#if $errors.phoneNumber}
        <span class="error-text">{$errors.phoneNumber}</span>
      {/if}
    </div>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting}>
      {#if $submitting}
        Saving...
      {:else}
        {isEdit ? 'Update' : 'Create'} Funeral Home
      {/if}
    </button>
  </div>
</form>