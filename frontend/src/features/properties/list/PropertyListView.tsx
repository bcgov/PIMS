import './PropertyListView.scss';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { ENVIRONMENT } from 'constants/environment';
import { Table } from 'components/Table';
import { IPagedItems } from 'interfaces';
import { IPropertyFilter, IProperty } from '.';
import { columns as cols } from './columns';
import { Container, Button } from 'react-bootstrap';
import download from './../../../utils/download';
import { useDispatch } from 'react-redux';

const getPropertyListUrl = (filter: IPropertyFilter) =>
  `${ENVIRONMENT.apiUrl}/properties/search/page?${filter ? queryString.stringify(filter) : ''}`;

const getPropertyReportUrl = (filter: IPropertyFilter) =>
  `${ENVIRONMENT.apiUrl}/reports/properties?${filter ? queryString.stringify(filter) : ''}`;

const defaultFilter: IPropertyFilter = {
  page: 1,
  quantity: 10,
  agencies: [1, 2, 3, 4, 5, 6],
};

const PropertyListView: React.FC = () => {
  const columns = useMemo(() => cols, []);

  // We'll start our table without any data
  const [data, setData] = useState<IProperty[]>([]);
  const [filter, setFilter] = useState<IPropertyFilter>({ ...defaultFilter });
  // const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  // This will get called when the table needs new data
  const fetchData = useCallback(
    async ({ pageSize, pageIndex }: { pageSize: number; pageIndex: number }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // TODO: Set the loading state
      // setLoading(true);

      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        const newFilter = {
          ...filter,
          page: pageIndex + 1,
          quantity: pageSize,
        };

        const response = await CustomAxios().get<IPagedItems<IProperty>>(
          getPropertyListUrl(newFilter),
        );

        // The server could send back total page count.
        // For now we'll just calculate it.
        setData(response.data.items);
        setPageCount(Math.ceil(response.data.total / pageSize));
        setFilter(newFilter);

        // setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const dispatch = useDispatch();

  const fetch = (accept: 'csv' | 'excel') =>
    dispatch(
      download({
        url: getPropertyReportUrl(filter),
        fileName: `properties.${accept === 'csv' ? 'csv' : 'xlsx'}`,
        actionType: 'properties-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );

  return (
    <Container fluid className="PropertyListView">
      <Container fluid className="px-0 filter-container">
        <Container className="px-0">
          {/* <MapFilterBar
            agencyLookupCodes={agencies}
            propertyClassifications={propertyClassifications}
            lotSizes={lotSizes}
            onFilterChange={handleMapFilterChange}
          /> */}
        </Container>
      </Container>
      <div className="ScrollContainer">
        <Container fluid className="TableToolbar">
          <h3 className="mr-auto">Results</h3>
          <Button className="mr-2" onClick={() => fetch('excel')}>
            Export as Excel
          </Button>
          <Button onClick={() => fetch('csv')}>Export as CSV</Button>
        </Container>
        <Table<IProperty>
          name="propertiesTable"
          columns={columns}
          data={data}
          fetchData={fetchData}
          pageCount={pageCount}
        />
      </div>
    </Container>
  );
};

export default PropertyListView;
