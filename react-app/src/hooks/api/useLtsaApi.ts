import { IFetch } from '../useFetch';

export interface ITitleOwner {
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
}

export interface IOwnershipGroup {
  jointTenancyIndication: boolean;
  interestFractionNumerator: string;
  interestFractionDenominator: string;
  ownershipRemarks: string;
  titleOwners: ITitleOwner[];
}

export interface IChargeOwnershipGroup {
  jointTenancyIndication: boolean;
  interestFractionNumerator: string;
  interestFractionDenominator: string;
  ownershipRemarks: string;
  chargeOwners: {
    lastNameOrCorpName1: string;
    incorporationNumber: string;
  }[];
}

export interface IChargeItem {
  chargeNumber: string;
  transactionType: string;
  applicationReceivedDate: string;
  chargeOwnershipGroups: IChargeOwnershipGroup[];
  certificatesOfCharge: [];
  correctionsAltos1: [];
  corrections: [];
}

export interface IChargeOnTitle {
  chargeNumber: string;
  status: string;
  enteredDate: string;
  interAlia: string;
  chargeRemarks: string;
  chargeRelease: object;
  charge: IChargeItem;
}

export interface LtsaOrder {
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
        ownershipGroups: IOwnershipGroup[];
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
        chargesOnTitle?: IChargeOnTitle[];
        duplicateCertificatesOfTitle: string[];
        titleTransfersOrDispositions: string[];
      };
    };
  };
}

const useLtsaApi = (absoluteFetch: IFetch) => {
  const getLtsabyPid = async (pid: number): Promise<LtsaOrder> => {
    if (pid === 0) return undefined;
    const { parsedBody } = await absoluteFetch.get(`/ltsa/land/title?pid=${pid}`);
    return parsedBody as LtsaOrder;
  };
  return { getLtsabyPid };
};

export default useLtsaApi;
