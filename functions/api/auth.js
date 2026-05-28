import { v4 as uuidv4 } from '@cfworker/uuid';  // or use crypto.randomUUID()
import bcrypt from 'bcryptjs';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // REGISTER
  if (url.pathname.endsWith('/register') && request.method === 'POST') {
    const { name, email, password, isHost } = await request.json();
    const hashed = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    try {
      await env.DB.prepare(
        'INSERT INTO users (id, name, email, password, is_host) VALUES (?, ?, ?, ?, ?)'
      ).bind(id, name, email, hashed, isHost ? 1 : 0).run();
      
      const token = await createJWT(id, env.JWT_SECRET);
      return new Response(JSON.stringify({ token, user: { id, name, email, isHost } }), {
        headers: { 'Content-Type': 'application/json', 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800` }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Email exists' }), { status: 400 });
    }
  }
  
  // LOGIN
  if (url.pathname.endsWith('/login') && request.method === 'POST') {
    const { email, password } = await request.json();
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    if (!user || !await bcrypt.compare(password, user.password)) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
    const token = await createJWT(user.id, env.JWT_SECRET);
    return new Response(JSON.stringify({ token, user: { id: user.id, name: user.name, email, isHost: user.is_host } }), {
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=604800` }
    });
  }
  
  // LOGOUT
  if (url.pathname.endsWith('/logout')) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Set-Cookie': 'token=; Path=/; Max-Age=0' }
    });
  }
  
  return new Response('Not found', { status: 404 });
}

async function createJWT(userId, secret) {
  // You'll need a JWT library for Cloudflare Workers. Use 'jose' or 'jsonwebtoken' with node_compat.
  // Simplified: I'll provide a jwt helper later.
}
