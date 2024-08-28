const OPENAPI_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '3.0.0',
      title: 'PIMS Express API', // by default: 'REST API'
      description: 'A REST API that supports the Property Inventory Management System (PIMS).', // by default: ''
      contact: {
        name: 'Support',
        email: 'support@pims.gov.bc.ca', // TODO: Is this email real?
      },
      license: {
        name: 'APACHE',
        url: 'https://github.com/bcgov/PIMS/blob/dev/LICENSE',
      },
    },
    servers: [{ url: `${process.env.BACKEND_URL}/v2` }],
  },
  apis: ['./**/*.swagger.yaml'],
};

export default OPENAPI_OPTIONS;
