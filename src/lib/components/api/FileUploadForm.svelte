<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { fileUploadSchema, validateFileUpload } from '$lib/api/schemas/file';
  
  // Define props with runes
  let { 
    data,
    action = '?/uploadFile',
    ref = undefined,
    refId = undefined,
    field = undefined,
    path = undefined,
    accept = 'image/*',
    multiple = false,
    maxSizeMB = 10,
    onSuccess = () => {},
    onError = () => {}
  } = $props<{
    data: any;
    action?: string;
    ref?: string;
    refId?: string | number;
    field?: string;
    path?: string;
    accept?: string;
    multiple?: boolean;
    maxSizeMB?: number;
    onSuccess?: (fileInfo: any) => void;
    onError?: (error: any) => void;
  }>();

  // Initialize the form using Svelte 5 runes
  let loading = $state(false);
  let error = $state<string | null>(null);
  let files = $state<FileList | null>(null);
  let preview = $state<string[]>([]);
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  // Create form with file upload handling
  const { form, errors, enhance, submitting } = superForm(data.form, {
    validators: zod(fileUploadSchema),
    onSubmit: ({ formData, cancel }) => {
      if (!files || files.length === 0) {
        error = 'Please select at least one file';
        cancel();
        return;
      }

      // Check file size
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > maxSize) {
          error = `File "${file.name}" exceeds the maximum allowed size of ${maxSizeMB}MB`;
          cancel();
          return;
        }
      }

      // Add files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Add optional parameters if provided
      if (ref) formData.append('ref', ref);
      if (refId) formData.append('refId', String(refId));
      if (field) formData.append('field', field);
      if (path) formData.append('path', path);

      error = null;
      loading = true;
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        // Clear file input after successful upload
        files = null;
        preview = [];
        error = null;
        onSuccess(form);
      }
      loading = false;
    },
    onError: ({ result }) => {
      if ('error' in result && result.error && 'message' in result.error) {
        error = result.error.message || 'Upload failed';
      } else {
        error = 'Upload failed';
      }
      onError(result);
      loading = false;
    }
  });

  // Handle file selection and preview generation
  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      files = null;
      preview = [];
      return;
    }
    
    files = input.files;
    preview = [];
    
    // Generate previews for images
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            preview = [...preview, e.target.result.toString()];
          }
        };
        reader.readAsDataURL(file);
      } else {
        // For non-images, just add a placeholder
        preview = [...preview, ''];
      }
    }
  }

  // Clear selected files
  function clearFiles() {
    files = null;
    preview = [];
  }
</script>

{#if error}
  <div class="alert alert-error">
    {error}
  </div>
{/if}

<form method="POST" action="{action}" use:enhance enctype="multipart/form-data" class="upload-form">
  <div class="form-group">
    <label for="files" class="label">
      <span class="label-text">
        {multiple ? 'Select Files' : 'Select File'}
        <span class="text-xs text-surface-600-400">
          (Max {maxSizeMB}MB{multiple ? ' each' : ''})
        </span>
      </span>
      
      <div class="file-input-container border-2 border-dashed border-surface-300-600 rounded-lg p-8 text-center">
        <input 
          type="file" 
          id="files"
          name="files"
          accept={accept}
          multiple={multiple}
          on:change={handleFileSelect}
          class="hidden-file-input"
        />
        
        {#if !files || files.length === 0}
          <div class="upload-prompt">
            <div class="text-lg mb-2">Drag files here or click to browse</div>
            <div class="text-sm text-surface-600-400">
              {accept === 'image/*' ? 'Accepts images (JPG, PNG, GIF, etc.)' : `Accepts ${accept}`}
            </div>
          </div>
        {:else}
          <div class="selected-files mb-4">
            <div class="text-lg mb-2">Selected {files.length} {files.length === 1 ? 'file' : 'files'}</div>
            <button type="button" class="btn btn-sm" on:click={clearFiles}>Clear</button>
          </div>
          
          {#if preview.length > 0}
            <div class="file-previews grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {#each preview as url, i}
                {#if url}
                  <div class="preview-item aspect-square bg-surface-200-700">
                    <img src={url} alt={`Preview ${i+1}`} class="w-full h-full object-cover" />
                  </div>
                {:else}
                  <div class="preview-item aspect-square bg-surface-200-700 flex items-center justify-center">
                    {#if files && i < files.length}
                      <span class="text-xs">{files[i].name}</span>
                    {/if}
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </label>
    {#if $errors.files}
      <span class="error-text">{$errors.files}</span>
    {/if}
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary" disabled={$submitting || !files || files.length === 0}>
      {#if $submitting}
        Uploading...
      {:else}
        Upload{multiple ? ' Files' : ''}
      {/if}
    </button>
  </div>
</form>

<style>
  .hidden-file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
  
  .file-input-container {
    position: relative;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .preview-item {
    border-radius: 4px;
    overflow: hidden;
  }
