import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '3.0.0', // by default: '1.0.0'
    title: 'PIMS Express API', // by default: 'REST API'
    description: 'A REST API that supports the Property Inventory Management System (PIMS).', // by default: ''
    contact: {
      name: 'Support',
      email: 'support@pims.gov.bc.ca',
    },
    license: {
      name: 'APACHE',
      url: 'https://github.com/bcgov/PIMS/blob/dev/LICENSE',
    },
  },
  servers: [
    {
      url: '/api/v2', // by default: 'http://localhost:3000'
      description: '', // by default: ''
    },
    // { ... }
  ],
  tags: [
    // by default: empty Array
    // {
    //   name: '', // Tag name
    //   description: '', // Tag description
    // },
    // { ... }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        // arbitrary name for the security scheme
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  }, // by default: empty object
};

const outputFile = './swagger-output.json';
const routes = ['../routes/**/*.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);
