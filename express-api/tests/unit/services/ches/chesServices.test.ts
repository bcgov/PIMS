import chesServices, { IEmail } from '@/services/ches/chesServices';
import { randomUUID } from 'crypto';
import { produceEmail, produceSSO } from 'tests/testUtils/factories';
import * as config from '@/constants/config';
const _fetch = jest.fn().mockImplementation(() => {
  return {
    text: () => '{ a: 1 }',
  };
});
const _config = jest.fn().mockImplementation(() => ({ ches: { emailEnabled: 'true' } }));
jest.spyOn(config, 'default').mockImplementation(() => _config());
jest.spyOn(global, 'fetch').mockImplementation(() => _fetch());

describe('UNIT - Ches Services', () => {
  beforeEach(() => {
    _fetch.mockReset();
  });
  describe('sendEmailSync', () => {
    it('should return a valid token response', async () => {
      const email = produceEmail({ cc: ['john@doe.com'], bcc: ['john@doe.com'] });
      const keycloak = produceSSO();
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `{ "messages": [{}], "txId": "${randomUUID()}" }`,
      }));
      const response = await chesServices.sendEmailAsync(email, keycloak);
      expect(response.txId).toBeDefined();
    });
    it('should throw an error on null email', async () => {
      const email: IEmail = null;
      const keycloak = produceSSO();
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `{ "messages": [{}], "txId": "${randomUUID()}" }`,
      }));
      expect(async () => await chesServices.sendEmailAsync(email, keycloak)).rejects.toThrow();
    });
    it('should send email with extra config', async () => {
      const email: IEmail = produceEmail({});
      const keycloak = produceSSO();
      _config.mockImplementationOnce(() => ({
        ches: {
          emailEnabled: true,
          bccCurrentUser: true,
          usersToBcc: 'john@doe.com',
          overrideTo: 'john@doe.com',
          secondsToDelay: 1,
        },
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `{ "messages": [{}], "txId": "${randomUUID()}" }`,
      }));
      const response = await chesServices.sendEmailAsync(email, keycloak);
      expect(response.txId).toBeDefined();
    });
  });
  describe('getStatusByIdAsync', () => {
    it('should return a status', async () => {
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `

          {
          
              "createdTS": 1560000000,
              "delayTS": 1570000000,
              "msgId": "00000000-0000-0000-0000-000000000000",
              "smtpResponse": 
          
                  {},
                  "status": "completed",
                  "statusHistory": 
          
                  [],
                  "tag": "tag",
                  "txId": "00000000-0000-0000-0000-000000000000",
                  "updatedTS": 1570000000
              }
          
          `,
      }));
      const response = await chesServices.getStatusByIdAsync(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(response.status).toBeDefined();
      expect(response.tag).toBeDefined();
      expect(response.txId).toBeDefined();
    });
  });
  describe('getStatusesAsync', () => {
    it('should get an array of message statuses', async () => {
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `
            [
              {
            
                "createdTS": 1560000000,
                "delayTS": 1570000000,
                "msgId": "00000000-0000-0000-0000-000000000000",
                "smtpResponse": 
            
                  {},
                  "status": "completed",
                  "statusHistory": 
            
                    [],
                    "tag": "tag",
                    "txId": "00000000-0000-0000-0000-000000000000",
                    "updatedTS": 1570000000
              }
            ]
            `,
      }));
      const response = await chesServices.getStatusesAsync({
        txId: '00000000-0000-0000-0000-000000000000',
      });
      expect(response[0].status).toBeDefined();
      expect(response[0].tag).toBeDefined();
      expect(response[0].txId).toBeDefined();
    });
    it('should throw when filter is null', async () => {
      expect(async () => await chesServices.getStatusesAsync(null)).rejects.toThrow();
    });
    it('should throw when no valid filter keys', async () => {
      expect(async () => await chesServices.getStatusesAsync({})).rejects.toThrow();
    });
  });
  describe('cancelEmailByIdAsync', () => {
    it('should return an email status', async () => {
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `

          {
          
              "createdTS": 1560000000,
              "delayTS": 1570000000,
              "msgId": "00000000-0000-0000-0000-000000000000",
              "smtpResponse": 
          
                  {},
                  "status": "cancelled",
                  "statusHistory": 
          
                  [],
                  "tag": "tag",
                  "txId": "00000000-0000-0000-0000-000000000000",
                  "updatedTS": 1570000000
              }
          
          `,
      }));
      const response = await chesServices.cancelEmailByIdAsync(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(response.status).toBeDefined();
      expect(response.tag).toBeDefined();
      expect(response.txId).toBeDefined();
      expect(response.status).toBe('cancelled');
    });
    it('should return an email status and set the previously non-cancelled status', async () => {
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `

          {
          
              "createdTS": 1560000000,
              "delayTS": 1570000000,
              "msgId": "00000000-0000-0000-0000-000000000000",
              "smtpResponse": 
          
                  {},
                  "status": "accepted",
                  "statusHistory": 
          
                  [],
                  "tag": "tag",
                  "txId": "00000000-0000-0000-0000-000000000000",
                  "updatedTS": 1570000000
              }
          
          `,
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `

          {
          
              "createdTS": 1560000000,
              "delayTS": 1570000000,
              "msgId": "00000000-0000-0000-0000-000000000000",
              "smtpResponse": 
          
                  {},
                  "status": "accepted",
                  "statusHistory": 
          
                  [],
                  "tag": "tag",
                  "txId": "00000000-0000-0000-0000-000000000000",
                  "updatedTS": 1570000000
              }
          
          `,
      }));
      const response = await chesServices.cancelEmailByIdAsync(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(response.status).toBeDefined();
      expect(response.tag).toBeDefined();
      expect(response.txId).toBeDefined();
      expect(response.status).toBe('cancelled');
    });
  });
  describe('cancelEmailsAsync', () => {
    it('should get an array of message statuses', async () => {
      _fetch.mockImplementationOnce(() => ({
        text: () => '{"access_token":"eyAiYSI6IDEgfQ==.ewoiZXhwIjoxCn0="}',
      }));
      _fetch.mockImplementationOnce(() => ({
        text: () => `
            [
              {
            
                "createdTS": 1560000000,
                "delayTS": 1570000000,
                "msgId": "00000000-0000-0000-0000-000000000000",
                "smtpResponse": 
            
                  {},
                  "status": "cancelled",
                  "statusHistory": 
            
                    [],
                    "tag": "tag",
                    "txId": "00000000-0000-0000-0000-000000000000",
                    "updatedTS": 1570000000
              }
            ]
            `,
      }));
      const response = await chesServices.cancelEmailsAsync({
        txId: '00000000-0000-0000-0000-000000000000',
      });
      expect(response[0].status).toBeDefined();
      expect(response[0].tag).toBeDefined();
      expect(response[0].txId).toBeDefined();
      expect(response[0].status).toBe('cancelled');
    });
    it('should throw when filter is null', async () => {
      expect(async () => await chesServices.cancelEmailsAsync(null)).rejects.toThrow();
    });
    it('should throw when no valid filter keys', async () => {
      expect(async () => await chesServices.cancelEmailsAsync({})).rejects.toThrow();
    });
  });
});
