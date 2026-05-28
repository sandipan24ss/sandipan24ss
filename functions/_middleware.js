// Handles CORS and extracts user from JWT cookie
export async function onRequest(context) {
  const { request, next } = context;
  
  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': 'https://your-frontend.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
  
  const response = await next();
  response.headers.set('Access-Control-Allow-Origin', 'https://your-frontend.pages.dev');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}
