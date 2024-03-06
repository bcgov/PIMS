const config = {
  ches: {
    emailAuthorized: process.env.CHES_EMAIL_AUTHORIZED,
    alwaysBcc: process.env.CHES_ALWAYS_BCC,
    from: process.env.CHES_FROM,
    overrideTo: process.env.CHES_OVERRIDE_TO,
    bccUser: process.env.CHES_BCC_USER,
    alwaysDelay: process.env.CHES_ALWAYS_DELAY,
    emailEnabled: process.env.CHES_EMAIL_ENABLED,
  },
};

export default config;
