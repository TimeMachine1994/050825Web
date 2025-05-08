Form actions in SvelteKit provide a way to handle form submissions, interact with server-side logic, and update both state and props in your components. Here's a breakdown of how they work together, based on the provided sources:

Form Actions Overview: Form actions are defined in a +page.server.js file and allow you to POST data to the server using the <form> element [1]. Client-side JavaScript is optional but can be used to progressively enhance form interactions [1]. Actions always use POST requests, as GET requests should not have side effects [2].
Defining Actions: Inside +page.server.js, you export an actions object containing functions that handle the form submission. You can have a default action or multiple named actions [3].
// src/routes/login/+page.server.js
export const actions = {
  default: async (event) => {
    // Handle form data
  }
};
Invoking Actions: To invoke an action, you use a <form> element with method="POST". For the default action, the action attribute of the form can be omitted or set to the current page. For named actions, you add a query parameter with the name prefixed by a / character [4]. The formaction attribute on a button can also be used to POST to a different action than the parent <form> [4].
<!-- src/routes/login/+page.svelte -->
<form method="POST" action="?/register">
  <!-- content -->
</form>

<form method="POST">
  <button formaction="?/login">Log in</button>
  <button formaction="?/register">Register</button>
</form>
RequestEvent Object: Each action receives a RequestEvent object, which allows you to read the form data using request.formData() [5]. The action can then process the data (e.g., logging in a user, creating a database entry) [5].
Updating State with Form Data: You can use the data from the form to update the state of your application. You can also use the data to set cookies [5]. After processing the request, the action can return data that will be available through the form property on the corresponding page [5].
// Example action that sets a cookie
login: async ({ cookies, request }) => {
  const data = await request.formData();
  const email = data.get('email');
  cookies.set('email', email, { path: '/' });
  return { success: true };
},
Validation and Error Handling: If the data is invalid, you can use the fail function to return validation errors along with the previously submitted form values [6]. The status code is available through page.status and the data through form [6]. The returned data must be serializable as JSON [7].
// Example action that returns validation errors
default: async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');

  if (!email) {
    return fail(400, { email, missing: true });
  }
},
Updating Props: After an action runs, the page will be re-rendered (unless a redirect or error occurs), and the action's return value is available to the page as the form prop [8]. The page's load functions will run after the action completes [8].
<!-- src/routes/login/+page.svelte -->
<script>
  /** @type {import('./$types').PageProps} */
  let { data, form } = $props();
</script>

{#if form?.success}
  <p>Successfully logged in!</p>
{/if}
Progressive Enhancement: Form actions can be progressively enhanced with JavaScript using the use:enhance action [9, 10]. This allows you to provide a better user experience without full-page reloads [1]. Without an argument, use:enhance will emulate the browser-native behavior, but without full-page reloads [11].
Alternatives to Form Actions: While form actions are the preferred method, you can also use +server.js files to expose JSON APIs for sending data to the server [12]. However, form actions offer progressive enhancement benefits [12].