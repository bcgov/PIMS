export interface ILtsaOrder {
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
          marketValueAmount: string;
          fromTitles: { titleNumber: string; landTitleDistrict: string }[];
          natureOfTransfers: {
            transferReason: string;
          }[];
        };
        ownershipGroups: {
          jointTenancyIndication: boolean;
          interestFractionNumerator: string;
          interestFractionDenominator: string;
          ownershipRemarks: string;
          titleOwners: {
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
          }[];
        }[];

        taxAuthorities: {
          authorityName: string;
        }[];

        descriptionsOfLand: {
          parcelIdentifier: string;
          fullLegalDescription: string;
          parcelStatus: string;
        }[];

        legalNotationsOnTitle: {
          legalNotationNumber: string;
          status: string;
          legalNotation: {
            originalLegalNotationNumber: string;
            legalNotationText: string;
          };
        }[];
        duplicateCertificatesOfTitle: string[];
        titleTransfersOrDispositions: string[];
      };
    };
  };
}
