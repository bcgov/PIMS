const { NODE_ENV } = process.env;

export default {
  TESTING: NODE_ENV === 'test', // Can be used to disable certain features when testing
};
