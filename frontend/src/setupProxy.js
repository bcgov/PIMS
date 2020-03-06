const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: process.env.API_URL || 'http://backend/',
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
        // proxyReq.setHeader(
        //   'Authorization',
        //   'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxU0I4RVJHY0xGTldWQ2xMSFJXYmlMWDFsc1lwX3g4RkQ0aURnVUNlYjNVIn0.eyJqdGkiOiJlY2RiODE5Ni1hZTRlLTQ2ZDYtOGY2ZC1jMmU2Yjg4MDE0OTYiLCJleHAiOjE1NzY1NDI3MTAsIm5iZiI6MCwiaWF0IjoxNTc2NTQyNDEwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvYmNzYy1zd3UiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiNjEzY2RjMDEtMzcyOC00MjY3LTgxYTctNTc2YWU0ODFkMzVhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidGVhbS1ibHVlLWFwcCIsIm5vbmNlIjoiODFlMTNmMDctYTIzMC00MDIxLWEwODUtN2UzZDQ2NzZhYzA1IiwiYXV0aF90aW1lIjoxNTc2NTQyNDEwLCJzZXNzaW9uX3N0YXRlIjoiMWFmZWNkOGQtZDM1Ni00OGI2LWFlYTEtOWYwZGM2MTMzNjM4IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImNvbnRyaWJ1dG9yIiwibWFuYWdlLXVzZXJzIiwib2ZmbGluZV9hY2Nlc3MiLCJ2aWV3LXVzZXJzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbIm1hbmFnZS11c2VycyIsInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkNvbnRyaWJ1dG9yIFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjb250cmlidXRvciIsImdpdmVuX25hbWUiOiJDb250cmlidXRvciIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoiY29udHJpYnV0b3JAZW1haWwuY29tIn0.D-YKVpcDDt4WSh7B8jhjy9xyqb1hk3R-5yg5j7IqfphY1PVDjyAET4sYE0iBvZzvPeURUaYFPnWmAfgqtuvp5bgvT9I-zSDwnAxDA1vttYF6uoK3UbNEXkVCGTsgT7jw8x6SMMB01Ap_ElCvUT8ZZGSSkG9Y1qYmpxCxL6uzI7dzwbAUlm7dhbQsb1F0Tw2dohFhaMnIjSCDq9rRSRXTpFiMXU1nuWvntby6ONRQiUN25ZoAcpVMilqOwWb5kozuYsokZ_y2zJNM0fmHF6RIlYOR_4FMvMa3V8ddcNHIA4oDj2SZ3RZtKSscFS-DvqYp2yDn7EE7tOmXm2BJ8F4-yg',
        // );
      },
    }),
  );
};
