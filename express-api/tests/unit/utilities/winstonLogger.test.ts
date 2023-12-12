import logger from '../../../utilities/winstonLogger';

describe('UNIT - winston logger', () => {
  it('should be created with the expected settings', () => {
    expect(logger.level).toBe('http');
    expect(logger.transports).toHaveLength(1); // Only Console
  });
});
