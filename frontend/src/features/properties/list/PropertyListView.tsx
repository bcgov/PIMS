import './PropertyListView.scss';

import React, { useEffect, useState, useMemo } from 'react';
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

const filter: IPropertyFilter = {
  page: 1,
  quantity: 10,
  agencies: [1, 2, 3, 4, 5, 6],
};

const PropertyListView: React.FC = () => {
  const columns = useMemo(() => cols, []);
  const [data, setData] = useState<IProperty[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await CustomAxios().get<IPagedItems<IProperty>>(getPropertyListUrl(filter));
        setData(result.data.items);
      } catch (e) {
        setData([]);
      }
    };
    fetch();
  }, [filter]);

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
        <Table columns={columns} data={data} />
      </div>
    </Container>
  );
};

// TODO: REMOVE <---------------------
//
// export const getPropertyList = (filter: IPropertyFilter) => {
//   return CustomAxios()
//     .get(getPropertyListUrl(filter))
//     .then((response: AxiosResponse) => {
//       return response.data;
//     })
//     .catch((axiosError: AxiosError) => {
//       return [];
//     })
//     .finally(() => {});
// };

export default PropertyListView;
