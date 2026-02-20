export default function handler(req, res) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Simple hardcoded authentication
  const users = {
    'nick.fury@slooze.com': { password: 'password', role: 'Admin', name: 'Nick Fury' },
    'captain.marvel@slooze.com': { password: 'password', role: 'Member', name: 'Captain Marvel' },
    'america@slooze.com': { password: 'password', role: 'Manager', name: 'America' }
  };

  const user = users[email];
  
  if (user && user.password === password) {
    return res.status(200).json({ 
      success: true, 
      user: { 
        email, 
        role: user.role,
        name: user.name
      } 
    });
  }

  return res.status(401).json({ error: 'Invalid email or password' });
}