import * as React from 'react';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import InfoContent from './InfoContent';
import { IParcel, IBuilding } from 'actions/parcelsActions';
import { PropertyTypes } from 'constants/propertyTypes';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reducerTypes from 'constants/reducerTypes';
import { Provider } from 'react-redux';
import * as API from 'constants/API';
import { Workflows } from 'constants/workflows';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockParcelNoSub = {
  id: 1,
  pid: '000-000-000',
  zoning: '',
  zoningPotential: '',
  classificationId: 1,
  encumbranceReason: '',
  agencyId: '',
  isSensitive: false,
  latitude: 48,
  longitude: 123,
  classification: 'Core Operational',
  name: 'test name',
  description: 'test',
  assessedLand: 10000,
  assessedBuilding: 10000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 10000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  address: {
    id: 1,
    line1: '1234 mock Street',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  landArea: 123,
  landLegalDescription: 'test description',
  buildings: [],
  parcels: [],
  agency: 'AEST',
} as IParcel;

export const mockBuilding = {
  name: 'test name',
  id: 100,
  parcelId: '',
  pid: '',
  address: {
    id: 1,
    line1: '1234 mock Street',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  latitude: 48,
  longitude: 123,
  buildingConstructionTypeId: 0,
  buildingConstructionType: 'Concrete',
  classificationId: 1,
  classification: 'Core Operational',
  assessedLand: 10000,
  assessedBuilding: 10000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 11000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  rentableArea: 100,
  totalArea: 200,
  agency: 'AEST',
  agencyId: 0,
  agencyCode: 'KPU',
  subAgency: 'KPU',
  transferLeaseOnSale: false,
  isSensitive: false,
  buildingPredominateUse: 'University/College',
  buildingPredominateUseId: 0,
  buildingOccupantTypeId: 0,
  encumbranceReason: '',
  occupantName: 'test',
  parcels: [mockParcelNoSub],
  buildingTenancy: '100%',
  projectNumbers: ['SPP-00001'],
  projectStatus: 'On Market',
  projectWorkflow: Workflows.SPL,
} as IBuilding;

export const mockParcel = {
  id: 1,
  pid: '000-000-000',
  pin: '',
  projectNumber: '',
  zoning: '',
  zoningPotential: '',
  classificationId: 1,
  encumbranceReason: '',
  agencyId: '',
  isSensitive: false,
  latitude: 48,
  longitude: 123,
  classification: 'Core Operational',
  name: 'test name',
  description: 'test',
  assessedLand: 10000,
  assessedBuilding: 11000,
  evaluations: [
    {
      date: new Date(),
      key: 'Assessed',
      value: 10000,
    },
  ],
  fiscals: [
    {
      fiscalYear: 2020,
      key: 'NetBook',
      value: 10000,
    },
  ],
  address: {
    id: 1,
    line1: '1234 mock Street',
    line2: 'N/A',
    administrativeArea: 'Victoria',
    province: 'BC',
    postal: 'V1V1V1',
    provinceId: '1',
  },
  landArea: 123,
  landLegalDescription: 'test description',
  buildings: [mockBuilding],
  parcels: [],
  agency: 'AEST',
  subAgency: 'KPU',
  projectNumbers: ['SPP-00001'],
  projectStatus: 'In ERP',
  projectWorkflow: Workflows.ERP,
} as IParcel;

const lCodes = {
  lookupCodes: [
    {
      code: 'AEST',
      id: 1,
      isDisabled: false,
      name: 'Ministry of Advanced Education',
      type: API.AGENCY_CODE_SET_NAME,
    },
    {
      code: 'KPU',
      id: 181,
      isDisabled: false,
      name: 'Kwantlen Polytechnic University',
      type: API.AGENCY_CODE_SET_NAME,
    },
  ],
};

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const ContentComponent = (
  propertyInfo: IParcel | IBuilding | null,
  propertyTypeId: PropertyTypes | null,
  canViewDetails: boolean,
) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <InfoContent
          propertyInfo={propertyInfo}
          propertyTypeId={propertyTypeId}
          canViewDetails={canViewDetails}
        />
      </Router>
    </Provider>
  );
};

describe('InfoContent View', () => {
  it('InfoContent renders correctly', () => {
    const { container } = render(ContentComponent(mockParcel, PropertyTypes.PARCEL, true));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Shows all parcel information when can view', () => {
    const { getByText } = render(ContentComponent(mockParcel, PropertyTypes.PARCEL, true));
    expect(getByText('Parcel Identification')).toBeVisible();
    //Identification information
    expect(getByText('000-000-000')).toBeVisible();
    expect(getByText('test name')).toBeVisible();
    expect(getByText('Ministry of Advanced Education')).toBeVisible();
    expect(getByText('Kwantlen Polytechnic University')).toBeVisible();
    expect(getByText('Core Operational')).toBeVisible();
    //Location data
    expect(getByText('1234 mock Street')).toBeVisible();
    expect(getByText('Victoria')).toBeVisible();
    expect(getByText('48')).toBeVisible();
    //Legal Description
    expect(getByText('test description')).toBeVisible();
  });

  it('Lot size formats correctly', () => {
    const { getByText } = render(ContentComponent(mockParcel, PropertyTypes.PARCEL, true));
    expect(getByText('123 hectares')).toBeVisible();
  });

  it('Assessed value formats correctly', () => {
    const { getByText } = render(ContentComponent(mockParcel, PropertyTypes.PARCEL, true));
    expect(getByText('$10,000')).toBeVisible();
  });

  it('Shows project status if can view and property is in project', () => {
    const { getByText } = render(ContentComponent(mockParcel, PropertyTypes.PARCEL, true));
    expect(getByText('Property is in Enhanced Referral Process')).toBeVisible();
    expect(getByText('In ERP')).toBeVisible();
  });

  it('Does not show project status block if not in a project', () => {
    const { queryByText } = render(ContentComponent(mockParcelNoSub, PropertyTypes.PARCEL, true));
    expect(queryByText('Status: ')).toBeNull();
  });

  it('Shows limited parcel information when cannot view', () => {
    const { getByText, queryByText } = render(
      ContentComponent(mockParcel, PropertyTypes.PARCEL, false),
    );
    expect(queryByText('test name')).toBeNull();
    expect(queryByText('Ministry of Advanced Education')).toBeNull();
    expect(queryByText('Kwantlen Polytechnic University')).toBeNull();
    //contact SRES block is shown
    expect(getByText('For more information', { exact: false })).toBeVisible();
    //project status is hidden
    expect(queryByText('Status: ')).toBeNull();
  });

  it('Correct label if no sub agency', () => {
    const { getByText } = render(ContentComponent(mockParcelNoSub, PropertyTypes.PARCEL, true));
    expect(getByText('Owning ministry')).toBeVisible();
  });

  it('Shows all building information when can view', () => {
    const { getByText } = render(ContentComponent(mockBuilding, PropertyTypes.BUILDING, true));
    expect(getByText('Building Identification')).toBeVisible();
    //Identification information
    expect(getByText('test name')).toBeVisible();
    expect(getByText('Ministry of Advanced Education')).toBeVisible();
    expect(getByText('Kwantlen Polytechnic University')).toBeVisible();
    expect(getByText('Core Operational')).toBeVisible();
    //Location data
    expect(getByText('1234 mock Street')).toBeVisible();
    expect(getByText('Victoria')).toBeVisible();
    expect(getByText('48')).toBeVisible();
    //Building Attributes
    expect(getByText('University/College')).toBeVisible();
    expect(getByText('100%')).toBeVisible();
    //Project status block
    expect(getByText('Property is on the Surplus Properties List')).toBeVisible();
    expect(getByText('On Market')).toBeVisible();
  });

  it('Building area formated correctly', () => {
    const { getByText } = render(ContentComponent(mockBuilding, PropertyTypes.BUILDING, true));
    expect(getByText('100 sq. metres')).toBeVisible();
  });

  it('Shows limited building information when cannot view', () => {
    const { getByText, queryByText } = render(
      ContentComponent(mockBuilding, PropertyTypes.BUILDING, false),
    );
    expect(queryByText('test name')).toBeNull();
    expect(queryByText('Ministry of Advanced Education')).toBeNull();
    expect(queryByText('Kwantlen Polytechnic University')).toBeNull();
    //contact SRES block is shown
    expect(getByText('For more information', { exact: false })).toBeVisible();
  });
});
