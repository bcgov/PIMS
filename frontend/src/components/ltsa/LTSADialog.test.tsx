import { render } from '@testing-library/react';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import { TitleOwnership } from 'features/mapSideBar/components/tabs/TitleOwnership';
import React from 'react';

const SeymourLTSA: ILTSAOrderModel = {
  order: {
    productType: 'title',
    fileReference: 'Test',
    productOrderParameters: {
      titleNumber: 'ET97853',
      landTitleDistrictCode: 'VI',
      includeCancelledInfo: false,
    },
    orderId: '3fc49372-3f8d-4551-b7ec-ac04bace137c',
    status: 'Processing',
    billingInfo: {
      billingModel: 'PROV',
      productName: 'Searches',
      productCode: 'Search',
      feeExempted: true,
      productFee: 0,
      serviceCharge: 0,
      subtotalFee: 0,
      productFeeTax: 0,
      serviceChargeTax: 0,
      totalTax: 0,
      totalFee: 0,
    },
    orderedProduct: {
      fieldedData: {
        titleStatus: 'REGISTERED',
        titleIdentifier: {
          titleNumber: 'ET97853',
          landTitleDistrict: 'VICTORIA',
        },
        tombstone: {
          applicationReceivedDate: '2002-08-26T20:28:00Z',
          enteredDate: '2002-08-30T16:45:35Z',
          titleRemarks: '',
          marketValueAmount: '',
          fromTitles: [
            {
              titleNumber: 'ET88415',
              landTitleDistrict: 'VICTORIA',
            },
          ],
          natureOfTransfers: [
            {
              transferReason: 'CHANGE OF NAME',
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
                lastNameOrCorpName1: '4000 SEYMOUR PLACE BUILDING LTD.',
                givenName: '',
                incorporationNumber: '651373',
                occupationDescription: '',
                address: {
                  addressLine1: 'SUITE 1650 - 409 GRANVILLE STREET',
                  addressLine2: '',
                  city: 'VANCOUVER',
                  province: 'BC',
                  provinceName: 'BRITISH COLUMBIA',
                  country: 'CANADA',
                  postalCode: 'V6C 1T2',
                },
              },
            ],
          },
        ],
        taxAuthorities: [
          {
            authorityName: 'Saanich, The Corporation of the District of',
          },
        ],
        descriptionsOfLand: [
          {
            parcelIdentifier: '000-382-345',
            fullLegalDescription: 'LOT 1, SECTION 7, VICTORIA DISTRICT, PLAN 40894',
            parcelStatus: 'A',
          },
        ],
        legalNotationsOnTitle: [
          {
            legalNotationNumber: 'CA1737116',
            status: 'ACTIVE',
            legalNotation: {
              applicationReceivedDate: '2010-09-20T16:51:19Z',
              originalLegalNotationNumber: 'CA1737116',
              legalNotationText:
                'PERSONAL PROPERTY SECURITY ACT NOTICE SEE CA1737116 EXPIRES 2018/09/20',
            },
          },
          {
            legalNotationNumber: 'CA4219808',
            status: 'ACTIVE',
            legalNotation: {
              applicationReceivedDate: '2015-02-05T01:27:57Z',
              originalLegalNotationNumber: 'CA1737116',
              legalNotationText:
                'PERSONAL PROPERTY SECURITY ACT NOTICE OF ASSIGNMENT, SEE CA4219808',
            },
          },
          {
            legalNotationNumber: 'CV289967',
            status: 'ACTIVE',
            legalNotation: {
              originalLegalNotationNumber: 'CV289967',
              legalNotationText:
                'THIS TITLE MAY BE AFFECTED BY A PERMIT UNDER PART 29,\nMUNICIPAL ACT, SEE DF EE73767.',
            },
          },
          {
            legalNotationNumber: 'ET94309',
            status: 'ACTIVE',
            legalNotation: {
              applicationReceivedDate: '2002-08-15T21:22:00Z',
              originalLegalNotationNumber: 'ET94309',
              legalNotationText:
                'NOTICE OF INTEREST, BUILDERS LIEN ACT (S.3(2)), SEE ET94309\nFILED 2002-08-15',
            },
          },
        ],
        duplicateCertificatesOfTitle: [],
        titleTransfersOrDispositions: [],
      },
    },
  },
};

const SeymourPid = '000382345';

describe('LTSA Dialog', () => {
  it('renders with all elements when info supplied', () => {
    const { getByText } = render(<TitleOwnership ltsa={SeymourLTSA} pid={SeymourPid} />);
    expect(getByText(/This information was retrieved from/)).toBeInTheDocument();
    expect(getByText(/Title Details/)).toBeInTheDocument();
    expect(getByText(/Ownership Information/)).toBeInTheDocument();
    expect(getByText(/Charges/)).toBeInTheDocument();
  });

  it('renders with all elements, even with no pid', () => {
    const { getByText } = render(<TitleOwnership ltsa={SeymourLTSA} />);
    expect(getByText(/This information was retrieved from/)).toBeInTheDocument();
    expect(getByText(/Title Details/)).toBeInTheDocument();
    expect(getByText(/Ownership Information/)).toBeInTheDocument();
    expect(getByText(/Charges/)).toBeInTheDocument();
  });

  it('displays that LTSA is not available when pid does not match', () => {
    const { getByText } = render(<TitleOwnership ltsa={SeymourLTSA} pid={'78394849'} />);
    expect(
      getByText(/No LTSA information available for this PID or information still loading./),
    ).toBeInTheDocument();
  });

  it('displays that LTSA is not available when undefined', () => {
    const { getByText } = render(<TitleOwnership ltsa={undefined} />);
    expect(
      getByText(/No LTSA information available for this PID or information still loading./),
    ).toBeInTheDocument();
  });
});
