import { ENVIRONMENT } from 'constants/environment';
import * as React from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { useAppDispatch } from 'store';

import download from '../utils/download';

/**
 * Test provides a testing page for various things.
 */
export const Test = () => {
  const dispatch = useAppDispatch();

  const fetch = (accept: 'csv' | 'excel') =>
    download({
      url: ENVIRONMENT.apiUrl + '/reports/properties?classificationId=1',
      fileName: `pims-inventory.${accept === 'csv' ? 'csv' : 'xlsx'}`,
      actionType: 'properties-report',
      headers: {
        Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
      },
    })(dispatch);

  return (
    <Container>
      <h3>Property Reports</h3>
      <hr />
      <ButtonGroup>
        <Button onClick={() => fetch('csv')}>Download CSV</Button>
        <Button onClick={() => fetch('excel')}>Download Excel</Button>
      </ButtonGroup>
    </Container>
  );
};

export default Test;
