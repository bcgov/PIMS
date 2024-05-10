import { ILtsaOrder } from '@/services/ltsa/interfaces/ILtsaOrder';
import app from '@/express';
import supertest from 'supertest';

const request = supertest(app);

// TODO: enable tests when route is implemented
// TODO: determine if LTSA request should be mocked for test
describe('INTEGRATION - GET /ltsa', () => {
  // TODO: pass fake keycloak token once route is protected
  const TOKEN = '';
  it('should return 401 Unauthorized if invalid token provided', async () => {
    const response = await request
      .get(`/v2/ltsa/land/title?pid=0`)
      .set('Authorization', `Bearer notAToken`);
    expect(response.status).toBe(401);
  });

  xit('should return a 200 status code and a body with the LTSA info', async () => {
    const pid = '000382345'; // PID for 4000 Seymour, Victoria, BC
    const response = await request
      .get(`/v2/ltsa/land/title?pid=${pid}`)
      .set('Authorization', `Bearer ${TOKEN}`);

    const ltsaInfo: ILtsaOrder = response.body;
    expect(response.status).toBe(200);
    expect(ltsaInfo.order.productOrderParameters.titleNumber).toBe('ET97853');
    expect(
      ltsaInfo.order.orderedProduct.fieldedData.ownershipGroups.at(0)?.titleOwners.at(0)
        ?.lastNameOrCorpName1,
    ).toBe('4000 SEYMOUR PLACE BUILDING LTD.');
    expect(
      ltsaInfo.order.orderedProduct.fieldedData.ownershipGroups.at(0)?.titleOwners.at(0)
        ?.incorporationNumber,
    ).toBe('651373');
    expect(
      ltsaInfo.order.orderedProduct.fieldedData.descriptionsOfLand.at(0)?.parcelIdentifier,
    ).toBe('000-382-345');
  });

  xit('should return a 404 status code if the PID is invalid', async () => {
    const pid = 'notapid';
    const response = await request
      .get(`/v2/ltsa/land/title?pid=${pid}`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(404);
  });
});
