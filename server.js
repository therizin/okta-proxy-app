const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Proxy Okta API calls
const oktaDomain = 'https://trial-1584011.okta.com';

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Allow parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/oauth2', createProxyMiddleware({
  target: oktaDomain,
  changeOrigin: true,
  pathRewrite: { '^/oauth2': '/oauth2' },
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
      const bodyData = new URLSearchParams(req.body).toString();
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.get('/.well-known/openid-configuration', (req, res) => {
  res.json({
    issuer: "https://okta-proxy-app.onrender.com/oauth2/default",
    authorization_endpoint: "https://okta-proxy-app.onrender.com/oauth2/default/v1/authorize",
    token_endpoint: "https://okta-proxy-app.onrender.com/oauth2/default/v1/token",
    userinfo_endpoint: "https://okta-proxy-app.onrender.com/oauth2/default/v1/userinfo",
    jwks_uri: "https://okta-proxy-app.onrender.com/oauth2/default/v1/keys",
    registration_endpoint: "https://okta-proxy-app.onrender.com/oauth2/v1/clients",
    introspection_endpoint: "https://okta-proxy-app.onrender.com/oauth2/default/v1/introspect",
    revocation_endpoint: "https://okta-proxy-app.onrender.com/oauth2/default/v1/revoke",
    response_types_supported: ["code", "id_token", "code id_token", "token id_token", "token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    scopes_supported: ["openid", "email", "profile"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
    claims_supported: ["sub", "iss", "name", "email"],
    code_challenge_methods_supported: ["S256"],
    grant_types_supported: ["authorization_code", "implicit", "refresh_token"],
  });
});

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
