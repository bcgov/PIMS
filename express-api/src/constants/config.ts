const config = {
  ches: {
    usersToBcc: process.env.CHES_ALWAYS_BCC, // Semi-colon separated list of emails to include in the BCC
    defaultFrom: process.env.CHES_DEFAULT_FROM, // Default to this for the from field if email does not supply it.
    overrideTo: process.env.CHES_OVERRIDE_TO, // Override the to field to this every time, useful for testing.
    bccCurrentUser: process.env.CHES_BCC_USER === 'true', // If true, current user will be included in bcc list.
    secondsToDelay: process.env.CHES_SECONDS_TO_DELAY, // Added in seconds to the delayTS to delay the email send date.
    emailEnabled: process.env.CHES_EMAIL_ENABLED === 'true', // If false, emails will not send at all.
  },
};

const getConfig = () => {
  return config;
};

export default getConfig;
