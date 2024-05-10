export interface ILtsaOrderInfo {
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
        chargesOnTitle?: {
          chargeNumber: string;
          status: string;
          enteredDate: string;
          interAlia: string;
          chargeRemarks: string;
          charge: {
            chargeNumber: string;
            transactionType: string;
            applicationReceivedDate: string;
            chargeOwnershipGroups: {
              jointTenancyIndication: boolean;
              interestFractionNumerator: string;
              interestFractionDenominator: string;
              ownershipRemarks: string;
              chargeOwners: {
                lastNameOrCorpName1: string;
                incorporationNumber: string;
              }[];
            }[];
            certificatesOfCharge: [];
            correctionsAltos1: [];
            corrections: [];
          };
          chargeRelease: object;
        }[];
        duplicateCertificatesOfTitle: string[];
        titleTransfersOrDispositions: string[];
      };
    };
  };
}
