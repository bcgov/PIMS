import { ILtsaTitleSummaryResponse } from '@/services/ltsa/interfaces/ILtsaTitleSummaryModel';
import ltsaServices from './../../../../src/services/ltsa/ltsaServices';
import { ILtsaOrder } from '@/services/ltsa/interfaces/ILtsaOrder';
import { randomUUID } from 'crypto';

const OrderDetails: ILtsaOrder = {
  order: {
    productType: 'title',
    fileReference: 'Test',
    productOrderParameters: {
      titleNumber: 'EP1421',
      landTitleDistrictCode: 'VI',
      includeCancelledInfo: false,
    },
    orderId: randomUUID(),
    status: 'Processing',
    billingInfo: {
      billingModel: 'PROV',
      productName: 'Searches',
      productCode: 'Search',
      feeExempted: true,
      productFee: 0,
      serviceCharge: 0.0,
      subtotalFee: 0.0,
      productFeeTax: 0,
      serviceChargeTax: 0.0,
      totalTax: 0.0,
      totalFee: 0.0,
    },
    orderedProduct: {
      fieldedData: {
        titleStatus: 'REGISTERED',
        titleIdentifier: {
          titleNumber: 'EP1421',
          landTitleDistrict: 'VICTORIA',
        },
        tombstone: {
          applicationReceivedDate: new Date('2000-01-07T18:40:00Z').toISOString(),
          enteredDate: new Date('2000-02-02T21:44:20Z').toISOString(),
          titleRemarks: '',
          marketValueAmount: '',
          fromTitles: [{ titleNumber: 'EE55748', landTitleDistrict: 'VICTORIA' }],
          natureOfTransfers: [
            {
              transferReason: 'SEE DOCUMENTATION',
            },
          ],
        },
        ownershipGroups: [
          {
            jointTenancyIndication: false,
            interestFractionNumerator: '1',
            interestFractionDenominator: '1',
            ownershipRemarks: '',
            titleOwners: [
              {
                lastNameOrCorpName1: 'BC TRANSPORTATION FINANCING AUTHORITY',
                givenName: '',
                incorporationNumber: '',
                occupationDescription: '',
                address: {
                  addressLine1: 'BOX 9900, STN. PROV. GOVT.',
                  addressLine2: '',
                  city: 'VICTORIA',
                  province: 'BC',
                  provinceName: 'BRITISH COLUMBIA',
                  country: 'CANADA',
                  postalCode: 'V8W 9R1',
                },
              },
            ],
          },
        ],
        taxAuthorities: [
          {
            authorityName: 'Central Saanich, The Corporation of the District of',
          },
        ],
        descriptionsOfLand: [
          {
            parcelIdentifier: '005-666-767',
            fullLegalDescription:
              'LOT 2, SECTION 12, RANGE 4 EAST, SOUTH SAANICH DISTRICT, PLAN 7627',
            parcelStatus: 'A',
          },
        ],
        legalNotationsOnTitle: [
          {
            legalNotationNumber: 'CV109555',
            status: 'ACTIVE',
            legalNotation: {
              originalLegalNotationNumber: 'CV109555',
              legalNotationText:
                'THIS CERTIFICATE OF TITLE MAY BE AFFECTED BY THE AGRICULTURAL LAND\nCOMMISSION ACT; SEE AGRICULTURAL LAND RESERVE PLAN NO. 4, DEPOSITED\nJULY 11, 1974',
            },
          },
          {
            legalNotationNumber: '243094G',
            status: 'ACTIVE',
            legalNotation: {
              originalLegalNotationNumber: '243094G',
              legalNotationText:
                'HERETO IS ANNEXED EASEMENT 243094G OVER PART OF LOT 1, PLAN 7627\nEXCEPT PART LYING EAST OF PLAN 805RW AND EXCEPT PART IN PLAN 805RW',
            },
          },
        ],
        duplicateCertificatesOfTitle: [],
        titleTransfersOrDispositions: [],
      },
    },
  },
};
const _fetchtoken = jest.fn().mockImplementation(() => {
  return {
    ok: true,
    json: () => ({
      accessToken: 'accesstoken',
      refreshToken: 'refreshtoken',
    }),
  };
});
const _fetchsummary = jest.fn().mockImplementation(() => {
  return {
    ok: true,
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
  };
});
const _fetchorder = jest.fn().mockImplementation(() => {
  return {
    ok: true,
    json: () => ({ ...OrderDetails }),
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
  });
});
describe('ProcessLTSARequest', () => {
  it('should return an order model', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(() => _fetchtoken())
      .mockImplementationOnce(() => _fetchsummary())
      .mockImplementationOnce(() => _fetchorder());
    const expectedResponse: ILtsaOrder = OrderDetails;
    const pid = '005-666-767';
    const result = await ltsaServices.processLTSARequest(pid);
    expect(result.order.orderedProduct.fieldedData.descriptionsOfLand[0].parcelIdentifier).toEqual(
      pid,
    );
    expect(
      expectedResponse.order.orderedProduct.fieldedData.titleIdentifier.landTitleDistrict,
    ).toEqual('VICTORIA');
  });
});
