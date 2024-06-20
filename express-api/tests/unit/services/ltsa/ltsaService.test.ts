import { ILtsaTitleSummaryResponse } from '@/services/ltsa/interfaces/ILtsaTitleSummaryModel';
import ltsaServices from './../../../../src/services/ltsa/ltsaServices';
import { ILtsaOrder } from '@/services/ltsa/interfaces/ILtsaOrder';
import { produceLtsaOrder } from 'tests/testUtils/factories';

const _fetchtoken = jest.fn().mockImplementation((ok: boolean = true) => {
  return {
    ok,
    json: () => ({
      accessToken: 'accesstoken',
      refreshToken: 'refreshtoken',
    }),
  };
});
const _fetchsummary = jest.fn().mockImplementation((ok: boolean = true) => {
  return {
    ok,
    json: () => ({
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
    }),
    text: async () => '{ "errorMessages": [] }',
  };
});
const _fetchorder = jest.fn().mockImplementation((ok: boolean = true) => {
  return {
    ok,
    json: () => produceLtsaOrder(),
  };
});

describe('UNIT - LTSA Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('GetLtsaTokenAsync', () => {
    it('should return a token', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => _fetchtoken());
      const result = await ltsaServices.getTokenAsync();
      expect(result).toBeDefined();
      expect(result.accessToken).toEqual('accesstoken');
      expect(result.refreshToken).toEqual('refreshtoken');
    });
    it('should return an error code', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => _fetchtoken(false));
      expect(async () => await ltsaServices.getTokenAsync()).rejects.toThrow();
    });
  });

  describe('GetTitleSummary', () => {
    it('should return a title summary response', async () => {
      const accessToken = 'accesstokentitlesummary';
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => _fetchsummary());
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
      expect(expectedResponse.titleSummaries[0].landTitleDistrict).toEqual(
        result.titleSummaries[0].landTitleDistrict,
      );
    });
    it('should return a error code', async () => {
      const accessToken = 'accesstokentitlesummary';
      jest.spyOn(global, 'fetch').mockImplementationOnce(() => _fetchsummary(false));
      const parcelIdentifier = '005-666-767';
      expect(
        async () => await ltsaServices.getTitleSummary(accessToken, parcelIdentifier),
      ).rejects.toThrow();
    });
  });
});
describe('ProcessLTSARequest', () => {
  it('should return an order model', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() => _fetchtoken())
      .mockImplementationOnce(() => _fetchsummary())
      .mockImplementationOnce(() => _fetchorder());
    const expectedResponse: ILtsaOrder = produceLtsaOrder();
    const pid = '005-666-767';
    const result = await ltsaServices.processLTSARequest(pid);
    expect(
      result.order.orderedProduct.fieldedData.descriptionsOfLand[0].parcelIdentifier,
    ).toBeTruthy();
    expect(
      expectedResponse.order.orderedProduct.fieldedData.titleIdentifier.landTitleDistrict,
    ).toEqual('VICTORIA');
  });
});
