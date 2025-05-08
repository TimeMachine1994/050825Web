<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { createTributeSchema, updateTributeSchema } from '$lib/api/schemas/tribute';
  
  // Define props with runes
  let { 
    data,
    action = '?/saveTribute',
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
  const schema = isEdit ? updateTributeSchema : createTributeSchema;

  // Initialize the form using Svelte 5 runes
  let loading = $state(false);
  let error = $state<string | null>(null);
  let slugify = $state(true);

  // Create slug from name when typing if slugify is enabled
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
  }

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
        error = result.error.message || 'Failed to save tribute';
      } else {
        error = 'Failed to save tribute';
      }
      onError(result);
    }
  });

  // Watch for name changes and update slug if automatic slug generation is enabled
  $effect(() => {
    if (slugify && $form.name) {
      $form.slug = generateSlug($form.name);
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
      <span class="label-text">Tribute Name*</span>
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
    <label for="slug" class="label">
      <span class="label-text">Slug*</span>
      <div class="flex gap-2 items-center">
        <input 
          type="text" 
          id="slug"
          name="slug"
          class="input flex-1"
          class:input-error={$errors.slug}
          bind:value={$form.slug}
          disabled={slugify}
        />
        <label class="flex items-center gap-1">
          <input type="checkbox" bind:checked={slugify} />
          <span class="text-sm">Auto</span>
        </label>
      </div>
    </label>
    {#if $errors.slug}
      <span class="error-text">{$errors.slug}</span>
    {/if}
    <span class="text-xs text-surface-600-400">
      This will be used in the URL: /celebration-of-life-for-{$form.slug || 'example-name'}
    </span>
  </div>

  <div class="form-group">
    <label for="description" class="label">
      <span class="label-text">Description</span>
      <textarea
        id="description"
        name="description"
        class="input"
        class:input-error={$errors.description}
        bind:value={$form.description}
        rows="5"
      ></textarea>
    </label>
    {#if $errors.description}
      <span class="error-text">{$errors.description}</span>
    {/if}
  </div>

  <div class="form-group">
    <label for="status" class="label">
      <span class="label-text">Status</span>
      <select
        id="status"
        name="status"
        class="input"
        class:input-error={$errors.status}
        bind:value={$form.status}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
    </label>
    {#if $errors.status}
      <span class="error-text">{$errors.status}</span>
    {/if}
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting}>
      {#if $submitting}
        Saving...
      {:else}
        {isEdit ? 'Update' : 'Create'} Tribute
      {/if}
    </button>
  </div>
</form>