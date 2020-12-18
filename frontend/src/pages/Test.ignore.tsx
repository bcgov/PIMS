import * as React from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { ENVIRONMENT } from 'constants/environment';
import download from '../utils/download';
import { useDispatch } from 'react-redux';

/**
 * Test provides a testing page for various things.
 */
const Test = () => {
  const dispatch = useDispatch();

  const fetch = (accept: 'csv' | 'excel') =>
    dispatch(
      download({
        url: ENVIRONMENT.apiUrl + '/reports/properties?classificationId=1',
        fileName: `pims-inventory.${accept === 'csv' ? 'csv' : 'xlsx'}`,
        actionType: 'properties-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );

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
