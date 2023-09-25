import { fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { UploadProperties } from './UploadProperties';

const history = createMemoryHistory();
const mockStore = configureMockStore([thunk]);
const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, [
  {
    pid: '1234',
  },
]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    {
      name: 'classificationVal',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
  usersAgencies: [{ id: '1', name: 'agencyVal' }],
});

const csvString =
  'parcelId,pid,pin,status,fiscalYear,agency,agencyCode,subAgency,propertyType,localId,name,description,classification,civicAddress,city,postal,latitude,longitude,landArea,landLegalDescription,buildingFloorCount,buildingConstructionType,buildingPredominateUse,buildingTenancy,buildingRentableArea,assessed,netBook\n\
000-118-397,000-118-397,123456789,Active,2023,1,AEST,,Land,PIMS Test,The Property,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15886178,-128.1077099,25,blahblah,0,string,string,string,0,1234560,1230\n\
120-118-397,120-118-397,225566,Active,2023,1,MAH,BCH,Land,PIMS Test,The Property 2,PIMS Testing,Core Operational,123 Test St,Abbotsford,ABC123,52.25886178,-128.1077099,25.6,testesttest test,0,string,string,string,0,1234560,1230\n\
020-118-397,020-118-397,35223333,Active,2023,1,AEST,,Land,PIMS Test,The Property 3,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15886178,-129.1077099,20,fresh fresh fruit,0,string,string,string,0,1234560,1230\n\
000-318-397,000-318-397,7848754,Active,2023,1,AEST,,Land,PIMS Test,The Property 4,PIMS Testing,Core Operational,123 Test St,Vancouver,ABC123,52.14886178,-127.1077099,100.5,just a string,0,string,string,string,0,1234560,1230\n\
000-118-392,000-118-392,4444444,Active,2023,1,MAH,BCH,Land,PIMS Test,The Property 5,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.15786178,-128.1088885,10,"just a string, just a string",0,string,string,string,0,1234560,1230\n\
000-122-397,000-122-397,11211131,Active,2023,1,AEST,,Land,PIMS Test,The Property 6,PIMS Testing,Core Operational,123 Test St,Campbell River,ABC123,52.15986178,-128.2077099,55,"one two, three",0,string,string,string,0,1234560,1230\n\
011-118-397,011-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 7,PIMS Testing,Core Operational,123 Test St,Nanaimo,ABC123,52.15686178,-128.1010099,1,under the water brdiget,0,string,string,string,0,1234560,1230\n\
660-118-397,660-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 8,PIMS Testing,Core Operational,123 Test St,Victoria,ABC123,52.16886178,-128.1087099,12,fresh fresh fruit,0,string,string,string,0,1234560,1230\n\
410-118-397,410-118-397,,Active,2023,1,AEST,,Land,PIMS Test,The Property 9,PIMS Testing,Core Operational,123 Test St,Alert Bay,ABC123,52.15887178,-128.1078099,0.985,fresh fresh fruit,0,string,string,string,0,1234560,1230\n';
const blob = new Blob([csvString], { type: 'text/csv' });
const file = new File([blob], 'test.csv', { type: 'text/csv' });

describe('Testing parent component for CSV Upload', () => {
  beforeEach(() => {});

  it('Sub-components render as expected', () => {
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <UploadProperties />,
        </MemoryRouter>
      </Provider>,
    );
    expect(queryByText(/instructions/i)).toBeInTheDocument();
    expect(queryByText(/select file/i)).toBeInTheDocument();
  });

  it('File upload process start to end', async () => {
    const { container, queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <UploadProperties />,
        </MemoryRouter>
      </Provider>,
    );
    // Upload file
    const fileInput = document.getElementById('file-input');
    await waitFor(() => {
      fireEvent.change(fileInput!, {
        target: { files: [file] },
      });
    });
    // Button should now be visible
    expect(container.querySelector('#upload-button')).toBeInTheDocument();
    // File name visible
    expect(queryByText('test.csv')).toBeInTheDocument();

    // Click "Start Upload"
    const startUpload = document.getElementById('upload-button');
    await waitFor(() => {
      fireEvent.click(startUpload!);
    });

    // Wait for state change
    await waitFor(() => {
      queryByText(/Do not leave/);
    });

    // Wait for last upload
    await waitFor(() => {
      queryByText(/PID 000-118-397/);
    });

    expect(queryByText('Upload Complete')).toBeInTheDocument();
  });
});
