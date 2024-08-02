const config = {
  ches: {
    username: process.env.CHES_USERNAME,
    password: process.env.CHES_PASSWORD,
    usersToBcc: process.env.CHES_ALWAYS_BCC, // Semi-colon separated list of emails to include in the BCC
    defaultFrom: process.env.CHES_DEFAULT_FROM, // Default to this for the from field if email does not supply it.
    overrideTo: process.env.CHES_OVERRIDE_TO, // Override the to field to this every time, useful for testing.
    bccCurrentUser: process.env.CHES_BCC_USER === 'true', // If true, current user will be included in bcc list.
    secondsToDelay: process.env.CHES_SECONDS_TO_DELAY, // Added in seconds to the delayTS to delay the email send date.
    emailEnabled: process.env.CHES_EMAIL_ENABLED === 'true', // If false, emails will not send at all.
    sendToLive: process.env.CHES_SEND_TO_LIVE === 'true', //For use in live testing environments. If this is false, and there is no overrideTo set, the requesting SSO user's email will be used as the "To" field.
  },
  ltsa: {
    authurl: process.env.LTSA_AUTH_URL,
    hosturl: process.env.LTSA_HOST_URL,
    integratorUsername: process.env.LTSA_INTEGRATOR_USERNAME,
    integratorPassword: process.env.LTSA_INTEGRATOR_PASSWORD,
    username: process.env.LTSA_USERNAME,
    password: process.env.LTSA_PASSWORD,
  },
  accessRequest: {
    // In previous PIMS, this is also a hardcoded value.
    // May be more robust to make this an environment variable or even a name, but I imagine these values
    // will basically never change.
    notificationTemplate: 15,
    notificationTemplateRPD: 17,
  },
  contact: {
    toEmail: process.env.CONTACT_EMAIL,
  },
  notificationTemplate: {
    title: 'PIMS',
    uri: process.env.FRONTEND_URL,
  },
};

const getConfig = () => {
  return config;
};

export default getConfig;
