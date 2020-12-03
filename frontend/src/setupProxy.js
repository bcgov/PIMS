const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:5000/',
      changeOrigin: true,
      secure: false,
      // timeout: 2000,
      xfwd: true,
      logLevel: 'debug',
      cookiePathRewrite: '/',
      cookieDomainRewrite: '',
      pathRewrite: function(path, req) {
        return path;
      },
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader('x-powered-by', 'onProxyReq');
      },
    }),
  );
};
