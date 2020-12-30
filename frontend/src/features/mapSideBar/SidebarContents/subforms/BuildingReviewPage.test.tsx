import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { noop } from 'lodash';
import { Formik } from 'formik';
import pretty from 'pretty';
import { BuildingReviewPage } from './BuildingReviewPage';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { Provider } from 'react-redux';

const mockStore = configureMockStore([thunk]);
const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const form = (
  <Formik initialValues={{ projectNumber: 'test', assessed: '' }} onSubmit={noop}>
    {(props: any) => (
      <Provider store={store}>
        <BuildingReviewPage
          classifications={[]}
          agencies={[]}
          occupantTypes={[]}
          predominateUses={[]}
          constructionType={[]}
        />
      </Provider>
    )}
  </Formik>
);

it('renders correctly', () => {
  const { container } = render(form);
  expect(pretty(container.innerHTML)).toMatchSnapshot();
});

it('building identificaiton fields disabled by default', () => {
  const { container } = render(form);

  const agency = container.querySelector('input[name="agencyId"]');
  const name = container.querySelector('input[name="name"]');
  const addr = container.querySelector('input[name="address.line1"]');
  const loc = container.querySelector('input[name="address.administrativeArea"]');
  const lat = container.querySelector('input[name="latitude"]');
  const long = container.querySelector('input[name="longitude"]');
  const classificationId = container.querySelector('select[name="classificationId"]');
  const usage = container.querySelector('select[name="buildingPredominateUseId"]');
  const constructionType = container.querySelector('select[name="buildingConstructionTypeId"]');
  const floors = container.querySelector('input[name="buildingFloorCount"]');
  const sensitive = container.querySelector('input[name="isSensitive"]');

  expect(agency).toBeDisabled();
  expect(name).toBeDisabled();
  expect(addr).toBeDisabled();
  expect(loc).toBeDisabled();
  expect(lat).toBeDisabled();
  expect(long).toBeDisabled();
  expect(classificationId).toBeDisabled();
  expect(usage).toBeDisabled();
  expect(constructionType).toBeDisabled();
  expect(floors).toBeDisabled();
  expect(sensitive).toBeDisabled();
});

it('identification section editable after click', () => {
  const { container } = render(form);

  const agency = container.querySelector('input[name="agencyId"]');
  const name = container.querySelector('input[name="name"]');
  const addr = container.querySelector('input[name="address.line1"]');
  const loc = container.querySelector('input[name="address.administrativeArea"]');
  const lat = container.querySelector('input[name="latitude"]');
  const long = container.querySelector('input[name="longitude"]');
  const classificationId = container.querySelector('select[name="classificationId"]');
  const usage = container.querySelector('select[name="buildingPredominateUseId"]');
  const constructionType = container.querySelector('select[name="buildingConstructionTypeId"]');
  const floors = container.querySelector('input[name="buildingFloorCount"]');
  const sensitive = container.querySelector('input[name="isSensitive"]');

  const edit = container.querySelectorAll('svg[class="edit"]');
  fireEvent.click(edit[0]!);

  expect(agency).not.toBeDisabled();
  expect(name).not.toBeDisabled();
  expect(addr).not.toBeDisabled();
  expect(loc).not.toBeDisabled();
  expect(lat).not.toBeDisabled();
  expect(long).not.toBeDisabled();
  expect(classificationId).not.toBeDisabled();
  expect(usage).not.toBeDisabled();
  expect(constructionType).not.toBeDisabled();
  expect(floors).not.toBeDisabled();
  expect(sensitive).not.toBeDisabled();
});

it('occupancy fields disabled by default', () => {
  const { container } = render(form);

  const totalArea = container.querySelector('input[name="squareFootage"]');
  const rentableArea = container.querySelector('input[name="rentableArea"]');
  const tenancy = container.querySelector('input[name="buildingTenancy"]');

  expect(totalArea).toBeDisabled();
  expect(rentableArea).toBeDisabled();
  expect(tenancy).toBeDisabled();
});

it('occupancy fields editable after click', () => {
  const { container } = render(form);

  const totalArea = container.querySelector('input[name="squareFootage"]');
  const rentableArea = container.querySelector('input[name="rentableArea"]');
  const tenancy = container.querySelector('input[name="buildingTenancy"]');

  const edit = container.querySelectorAll('svg[class="edit"]');
  fireEvent.click(edit[1]!);

  expect(totalArea).not.toBeDisabled();
  expect(rentableArea).not.toBeDisabled();
  expect(tenancy).not.toBeDisabled();
});

it('valuation fields disabled by default', () => {
  const { container } = render(form);

  const netbook = container.querySelector('input[name="data.financials.0.netbook.value"]');
  const assessed = container.querySelector('input[name="data.financials.0.assessed.value"]');

  expect(netbook).toBeDisabled();
  expect(assessed).toBeDisabled();
});

it('valuation fields editable after click', () => {
  const { container } = render(form);

  const netbook = container.querySelector('input[name="data.financials.0.netbook.value"]');
  const assessed = container.querySelector('input[name="data.financials.0.assessed.value"]');

  const edit = container.querySelectorAll('svg[class="edit"]');
  fireEvent.click(edit[2]!);

  expect(netbook).not.toBeDisabled();
  expect(assessed).not.toBeDisabled();
});
