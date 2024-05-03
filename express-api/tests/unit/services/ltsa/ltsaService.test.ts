import { ILtsaTitleSummaryResponse } from '@/services/ltsa/interfaces/ILtsaTitleSummaryModel';
import ltsaServices from './../../../../src/services/ltsa/ltsaServices';
import * as config from '@/constants/config';

const _config = jest.fn().mockImplementation(() => ({ ltsa: {} }));
jest.spyOn(config, 'default').mockImplementation(() => _config());

describe('UNIT - LTSA Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('GetLtsaTokenAsync', () => {
    it('should return a token', async () => {
      const result = await ltsaServices.getTokenAsync();
      expect(result).toBeDefined();
    });
  });

  describe('GetTitleSummary', () => {
    it('should return a title summary response', async () => {
      const tokenObject = await ltsaServices.getTokenAsync();
      const accessToken = tokenObject.accessToken;
      const parcelIdentifier = '005-666-767';
      const expectedResponse: ILtsaTitleSummaryResponse = {
        titleSummaries: [
          {
            titleNumber: 'EP1421',
            landTitleDistrict: 'Victoria',
            landTitleDistrictCode: 'VI',
            parcelIdentifier: '005-666-767',
            status: 'REGISTERED',
            firstOwner: 'BC*',
          },
        ],
      };

      const result = await ltsaServices.getTitleSummary(accessToken, parcelIdentifier);
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
  });
});
