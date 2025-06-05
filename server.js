const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware'); // <-- Add this line
const path = require('path');
const app = express();

// ✅ Okta domain to proxy to
const oktaDomain = 'https://trial-1584011.okta.com';

// ✅ Proxy Okta OAuth2 endpoints
app.use('/oauth2', createProxyMiddleware({
  target: oktaDomain,
  changeOrigin: true,
  pathRewrite: { '^/oauth2': '/oauth2' },
}));

// ✅ Serve static frontend (including Sign-In Widget)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Callback route (optional for testing)
app.get('/callback', (req, res) => {
  res.send('<h3>Login successful. You may close this window.</h3>');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
