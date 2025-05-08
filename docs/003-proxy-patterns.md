 How fetch Works in SvelteKit
SvelteKit builds upon standard Web APIs, including the Fetch API. The fetch function is available in various SvelteKit contexts: in hooks, server routes (+server.js), and in the browser.
However, there's a special version of fetch provided specifically within server-side load functions, server hooks (like handleFetch), and +server.js files. This version offers several key enhancements over the standard server-side fetch:
•
Credentialed Requests: It can be used to make requests on the server that include credentials, as it inherits the cookie and authorization headers from the incoming page request. Note that cookies are only passed through if the target host is the same as the SvelteKit application or a more specific subdomain.
•
Relative Requests: It allows you to make relative requests on the server, which is generally not possible with native server-side fetch.
•
Internal Request Optimization: Requests made using this fetch to other internal +server.js routes go directly to the handler function when running on the server, avoiding the overhead of an actual HTTP call.
•
SSR and Hydration: During server-side rendering, the response from fetch is captured and inlined into the rendered HTML. During hydration in the browser, the response is then read from the HTML instead of making a new network request, ensuring consistency and preventing redundant calls. Note that headers from the fetched response are not serialized unless explicitly included.
•
Dependency Tracking: When used in load functions, calling fetch(url) causes the load function to depend on that url, meaning it will rerun if invalidate(url) is called.
fetch and Server Proxies using +server.js
SvelteKit enables the creation of proxy endpoints primarily through the use of +server.js files. These files act as server-side routes that can intercept requests and forward them to other services or APIs.
The +server.js file exports functions corresponding to HTTP methods (GET, POST, etc.). Each handler function receives a RequestEvent object, which contains details about the incoming request, including the request property (a standard Web Request object), url, and params. These handlers are expected to return a Response object.
To implement a proxy using +server.js, the special SvelteKit fetch function is crucial:
1.
The +server.js handler receives the incoming request via the RequestEvent object.
2.
Information needed for the external request (headers, body, query parameters, etc.) is extracted from the RequestEvent and its request and url properties. For example, event.request.json() or event.request.formData() can be used to get the body for POST requests. event.url.searchParams provides access to query parameters.
3.
A new Request is often constructed using the extracted information to send to the target external service or API. Headers or body might be modified during this step.
4.
The SvelteKit fetch function (available in +server.js handlers) is then used to send this new Request to the target URL. This is where the enhancements of the SvelteKit fetch come into play, such as handling credentials and relative URLs if applicable.
5.
The fetch call returns a Response object from the target service.
6.
Finally, the +server.js handler constructs and returns a new Response object to the original client, often passing along the body and relevant headers received from the target service's response. SvelteKit provides helper functions like json() and text() to simplify creating these responses.
This approach allows the +server.js endpoint to act as an intermediary, forwarding the request and response.
Benefits of Using SvelteKit Proxy Endpoints with fetch
Leveraging +server.js and the SvelteKit fetch for proxying offers several advantages:
•
Abstraction: Hides the complexities of external APIs from the frontend.
•
Security: Allows adding authentication, authorization, and protection of sensitive keys on the server.
•
Manipulation: Enables modifying requests before sending them and transforming responses before returning them to the client.
•
CORS Management: Requests to external APIs originate from the server, bypassing browser-based CORS restrictions.
•
Simplified Frontend: Handles server-side logic and complex flows away from the client.
•
Integration: Seamlessly integrates with other SvelteKit features, including optimized internal API calls via fetch.
In essence, the SvelteKit fetch function, especially its server-side variant with enhanced capabilities, is a core tool for building proxy endpoints within +server.js files, enabling flexible and secure server-to-server communication orchestrated by your SvelteKit application.