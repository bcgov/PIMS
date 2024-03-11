/* eslint-disable no-var */
import chesServices from '@/services/ches/chesServices';
import { randomUUID } from 'crypto';
import { produceEmail, produceKeycloak } from 'tests/testUtils/factories';
import * as config from '@/constants/config';
const _fetch = jest.fn().mockImplementation(() => {
  return {
    text: () => '{ a: 1 }',
  };
});
const _config = jest.fn().mockImplementation(() => ({ ches: { emailEnabled: 'true' } as any}));
jest.spyOn(config, 'default').mockImplementation(() => _config());
jest.spyOn(global, 'fetch').mockImplementation(() => _fetch());

describe('UNIT - Ches Services', () => {
  describe('sendEmailSync', () => {
    it('should return a valid token response', async () => {
      const email = produceEmail({});
      const keycloak = produceKeycloak();
      _fetch.mockImplementationOnce(() => ({ text: () => '{"access_token":"aaaa"}' }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `{ "messages": [{}], "txId": "${randomUUID()}" }`,
      }));
      const response = await chesServices.sendEmailAsync(email, keycloak);
      expect(response.txId).toBeDefined();
    });
  });
});
