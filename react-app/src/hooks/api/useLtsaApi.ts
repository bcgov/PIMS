import { IFetch } from '../useFetch';

export interface Ltsa {
  order: {
    productType: string;
    fileReference: string;
    productOrderParameters: {
      titleNumber: string;
      landTitleDistrictCode: string;
      includeCancelledInfo: boolean;
    };
    orderId: string;
    status: string;
    billingInfo: {
      billingModel: string;
      productName: string;
      productCode: string;
      feeExempted: boolean;
      productFee: number;
      serviceCharge: number;
      subtotalFee: number;
      productFeeTax: number;
      serviceChargeTax: number;
      totalTax: number;
      totalFee: number;
    };
    orderedProduct: {
      fieldedData: {
        titleStatus: string;
        titleIdentifier: {
          titleNumber: string;
          landTitleDistrict: string;
        };
        tombstone: {
          applicationReceivedDate: string;
          enteredDate: string;
          titleRemarks: string;
          rootOfTitle: string;
          marketValueAmount: string;
          fromTitles: string[];
          natureOfTransfers: [
            {
              transferReason: string;
            },
          ];
        };
        ownershipGroups: [
          {
            jointTenancyIndication: boolean;
            interestFractionNumerator: string;
            interestFractionDenominator: string;
            ownershipRemarks: string;
            titleOwners: [
              {
                lastNameOrCorpName1: string;
                givenName: string;
                incorporationNumber: string;
                occupationDescription: string;
                address: {
                  addressLine1: string;
                  addressLine2: string;
                  city: string;
                  province: string;
                  provinceName: string;
                  country: string;
                  postalCode: string;
                };
              },
            ];
          },
        ];
        taxAuthorities: [
          {
            authorityName: string;
          },
        ];
        descriptionsOfLand: [
          {
            parcelIdentifier: string;
            fullLegalDescription: string;
            parcelStatus: string;
          },
        ];
        legalNotationsOnTitle: string[];
        duplicateCertificatesOfTitle: string[];
        titleTransfersOrDispositions: string[];
      };
    };
  };
}

const useLtsaApi = (absoluteFetch: IFetch) => {
  const getLtsabyPid = async (pid: number): Promise<Ltsa> => {
    const { parsedBody } = await absoluteFetch.get(`/ltsa/land/title/?pid=${pid}`);
    return parsedBody as Ltsa;
  };
  return { getLtsabyPid };
};

export default useLtsaApi;
