<script>
  import { enhance } from '$app/forms';

  // Form state
  let email = $state('');
  let password = $state('');
  let rememberMe = $state(false);
  let showPassword = $state(false);
  let isSubmitting = $state(false);
  let errors = $state({
    email: '',
    password: '',
    form: ''
  });

  // Derived validation states
  let isEmailValid = $derived.by(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== '' && emailRegex.test(email);
  });

  let isPasswordValid = $derived.by(() => {
    return password.length >= 6;
  });

  let isFormValid = $derived.by(() => {
    return isEmailValid && isPasswordValid;
  });

  // Form validation
  function validateForm() {
    // Reset errors
    errors = {
      email: '',
      password: '',
      form: ''
    };

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isEmailValid) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return isFormValid;
  }

  // Handle form submission
  function handleSubmit() {
    if (!validateForm()) {
      return false;
    }
    
    isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      isSubmitting = false;
      // In a real app, this would be handled by the server
      errors.form = 'Invalid credentials. Please try again.';
    }, 1500);
    
    return false;
  }

  // Toggle password visibility
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
          create a new account
        </a>
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      {#if errors.form}
        <div class="rounded-md bg-red-50 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {errors.form}
              </h3>
            </div>
          </div>
        </div>
      {/if}

      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border {errors.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {#if errors.email}
            <p class="mt-1 text-sm text-red-600" id="email-error">{errors.email}</p>
          {/if}
        </div>
        <div class="relative">
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autocomplete="current-password"
            required
            bind:value={password}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border {errors.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
            placeholder="Password"
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
            on:click={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            {/if}
          </button>
          {#if errors.password}
            <p class="mt-1 text-sm text-red-600" id="password-error">{errors.password}</p>
          {/if}
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            bind:checked={rememberMe}
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="/reset-password" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          {:else}
            Sign in
          {/if}
        </button>
      </div>
    </form>

    <div class="mt-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">
            New to the platform?
          </span>
        </div>
      </div>

      <div class="mt-6">
        <a
          href="/register"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Create an account
        </a>
      </div>
    </div>
  </div>
</div>
