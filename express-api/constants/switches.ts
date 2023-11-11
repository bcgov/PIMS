const { TESTING } = process.env;

export default {
  TESTING: `${TESTING}`.toLowerCase() === 'true',
};
