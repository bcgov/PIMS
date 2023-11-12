const { TESTING } = process.env;

export default {
  TESTING: `${TESTING}`.toLowerCase() === 'true', // Can be used to disable certain features
};
