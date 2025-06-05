const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Proxy Okta API calls
const oktaDomain = 'https://trial-1584011.okta.com';

app.use('/oauth2', createProxyMiddleware({
  target: oktaDomain,
  changeOrigin: true,
  pathRewrite: { '^/oauth2': '/oauth2' },
}));

app.use('/.well-known', createProxyMiddleware({
  target: oktaDomain,
  changeOrigin: true,
  pathRewrite: { '^/\\.well-known': '/.well-known' },
}));

app.use('/idp', createProxyMiddleware({
  target: oktaDomain,
  changeOrigin: true,
  pathRewrite: { '^/idp': '/idp' },
}));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
