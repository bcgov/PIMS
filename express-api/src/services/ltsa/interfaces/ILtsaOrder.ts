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
        chargesOnTitle: {
          chargeNumber: string;
          status: string;
          enteredDate: string; // '1994-08-30T18:13:00Z'
          interAlia: string;
          chargeRemarks: string;
          charge: {
            chargeNumber: string;
            transactionType: string;
            applicationReceivedDate: string; // '1994-08-30T18:13:00Z'
            chargeOwnershipGroups: {
              jointTenancyIndication: boolean;
              interestFractionNumerator: string; // number as string
              interestFractionDenominator: string; // number as string
              ownershipRemarks: string;
              chargeOwners: { lastNameOrCorpName1: string; incorporationNumber: string }[];
            }[];

            certificatesOfCharge: unknown[];
            correctionsAltos1: unknown[];
            corrections: unknown[];
          };
          chargeRelease: object;
        }[];
        duplicateCertificatesOfTitle: string[];
        titleTransfersOrDispositions: string[];
      };
    };
  };
}
