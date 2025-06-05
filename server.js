const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/oauth2', createProxyMiddleware({
  target: 'https://trial-1584011.okta.com',
  changeOrigin: true,
  pathRewrite: {
    '^/oauth2': '/oauth2'
  }
}));

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
