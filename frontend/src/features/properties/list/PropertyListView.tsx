import './PropertyListView.scss';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import queryString from 'query-string';
import _ from 'lodash';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import { decimalOrUndefined } from 'utils';
import download from 'utils/download';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import { IPropertyFilter, IProperty, FilterBar, IFilterBarState } from '.';
import { columns as cols } from './columns';
import { Table } from 'components/Table';
import service from '../service';
import { FaFolderOpen, FaFolder } from 'react-icons/fa';
import { Buildings } from './buildings';
import { useRouterFilter } from 'hooks/useRouterFilter';
import { FaFileExcel, FaFileAlt } from 'react-icons/fa';
import styled from 'styled-components';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';
import { PropertyTypes } from './FilterBar';

const getPropertyReportUrl = (filter: IPropertyFilter) =>
  `${ENVIRONMENT.apiUrl}/reports/properties?${filter ? queryString.stringify(filter) : ''}`;

const FileIcon = styled(Button)`
  background-color: #fff !important;
  color: #003366 !important;
  padding: 6px 5px;
`;

const initialQuery: IPropertyFilter = {
  page: 1,
  quantity: 10,
  agencies: [],
};

const getServerQuery = (state: {
  pageIndex: number;
  pageSize: number;
  filter: IFilterBarState;
  agencyIds: number[];
}) => {
  const {
    pageIndex,
    pageSize,
    filter: {
      pid,
      address,
      administrativeArea,
      projectNumber,
      classificationId,
      agencies,
      minLotSize,
      maxLotSize,
      parcelId,
      propertyType,
    },
  } = state;

  let parsedAgencies: number[] = [];
  if (agencies !== null && agencies !== undefined && agencies !== '') {
    parsedAgencies = [parseInt(agencies, 10)];
  }

  const query: IPropertyFilter = {
    ...initialQuery,
    address,
    pid,
    administrativeArea,
    projectNumber,
    classificationId: decimalOrUndefined(classificationId),
    agencies: parsedAgencies,
    minLandArea: decimalOrUndefined(minLotSize),
    maxLandArea: decimalOrUndefined(maxLotSize),
    page: pageIndex + 1,
    quantity: pageSize,
    parcelId: parcelId ? decimalOrUndefined(parcelId) : undefined,
    propertyType,
  };
  return query;
};

const PropertyListView: React.FC = () => {
  // lookup codes, etc
  const lookupCodes = useSelector<RootState, ILookupCode[]>(
    state => (state.lookupCode as ILookupCodeState).lookupCodes,
  );
  const agencies = useMemo(
    () =>
      _.filter(lookupCodes, (lookupCode: ILookupCode) => {
        return lookupCode.type === API.AGENCY_CODE_SET_NAME;
      }),
    [lookupCodes],
  );
  const propertyClassifications = _.filter(lookupCodes, (lookupCode: ILookupCode) => {
    return lookupCode.type === API.PROPERTY_CLASSIFICATION_CODE_SET_NAME;
  });

  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
  const columns = useMemo(() => cols, []);

  // We'll start our table without any data
  const [data, setData] = useState<IProperty[]>([]);
  // For getting the buildings on parcel folder click
  const [expandData, setExpandData] = useState<any>({});

  // Filtering and pagination state
  const [filter, setFilter] = useState<IFilterBarState>({
    searchBy: 'address',
    pid: '',
    address: '',
    administrativeArea: '',
    projectNumber: '',
    agencies: '',
    classificationId: '',
    minLotSize: '',
    maxLotSize: '',
    propertyType: PropertyTypes.Land,
  });

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  // const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    async (value: IFilterBarState) => {
      setFilter({ ...value });
      setPageIndex(0); // Go to first page of results when filter changes
    },
    [setFilter, setPageIndex],
  );

  // This will get called when the table needs new data
  const handleRequestData = useCallback(
    async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    },
    [setPageSize, setPageIndex],
  );

  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      filter,
      agencyIds,
    }: {
      pageIndex: number;
      pageSize: number;
      filter: IFilterBarState;
      agencyIds: number[];
    }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // TODO: Set the loading state
      // setLoading(true);

      // Only update the data if this is the latest fetch
      if (agencyIds?.length > 0) {
        const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
        const data = await service.getPropertyList(query);
        // The server could send back total page count.
        // For now we'll just calculate it.
        if (fetchId === fetchIdRef.current && data?.items) {
          setData(data.items);
          setPageCount(Math.ceil(data.total / pageSize));
        }

        // setLoading(false);
      }
    },
    [setData, setPageCount],
  );

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [fetchData, pageIndex, pageSize, filter, agencyIds]);

  const dispatch = useDispatch();
  useRouterFilter(filter, setFilter, 'listFilter');

  const fetch = (accept: 'csv' | 'excel') => {
    const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
    return dispatch(
      download({
        url: getPropertyReportUrl({ ...query, all: true }),
        fileName: `properties.${accept === 'csv' ? 'csv' : 'xlsx'}`,
        actionType: 'properties-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );
  };

  const checkExpanded = (row: IProperty, property: IProperty) => {
    const latLongcheck = row.latitude === property.latitude && row.longitude === property.longitude;
    const propertyTypeCheck = row.propertyTypeId === property.propertyTypeId;
    const pidOrPinCheck = row.pid === property.pid || row.pin === property.pin;
    return latLongcheck && propertyTypeCheck && pidOrPinCheck;
  };

  const loadBuildings = async (expandedRows: IProperty[]) => {
    if (expandedRows.length > 0) {
      await Promise.all(
        expandedRows.map(async property => {
          if (property.propertyTypeId === 0) {
            if (expandData[property.id] === undefined) {
              setExpandData({
                ...expandData,
                [property.id]: (await service.loadBuildings(property.id)).items,
              });
            }
          }
        }),
      );
    }
  };

  const changePropertyType = (type: PropertyTypes) => {
    setPageIndex(0);
    setFilter(state => {
      return {
        ...state,
        propertyType: type,
      };
    });
  };

  return (
    <Container fluid className="PropertyListView">
      <Container fluid className="filter-container border-bottom">
        <Container className="px-0">
          <FilterBar
            agencyLookupCodes={agencies}
            propertyClassifications={propertyClassifications}
            filter={filter}
            onChange={handleFilterChange}
          />
        </Container>
      </Container>
      <div className="ScrollContainer">
        <Container fluid className="TableToolbar">
          <h3>View Inventory</h3>
          <div className="menu">
            <div>
              <TooltipWrapper toolTipId="show-parcels" toolTip="Show Parcels">
                <div
                  className={
                    filter.propertyType === PropertyTypes.Land ? 'svg-btn active' : 'svg-btn'
                  }
                  onClick={() => changePropertyType(PropertyTypes.Land)}
                >
                  <LandSvg className="svg" />
                  Parcels view
                </div>
              </TooltipWrapper>
            </div>
            <div>
              <TooltipWrapper toolTipId="show-buildings" toolTip="Show Buildings">
                <div
                  className={
                    filter.propertyType === PropertyTypes.Building ? 'svg-btn active' : 'svg-btn'
                  }
                  onClick={() => changePropertyType(PropertyTypes.Building)}
                >
                  <BuildingSvg className="svg" />
                  Buildings view
                </div>
              </TooltipWrapper>
            </div>
          </div>
          <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to Excel">
            <FileIcon>
              <FaFileExcel size={36} onClick={() => fetch('excel')} />
            </FileIcon>
          </TooltipWrapper>
          <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to CSV">
            <FileIcon>
              <FaFileAlt size={36} onClick={() => fetch('csv')} />
            </FileIcon>
          </TooltipWrapper>
        </Container>
        <Table<IProperty>
          name="propertiesTable"
          lockPageSize={true}
          columns={columns}
          data={data}
          pageIndex={pageIndex}
          onRequestData={handleRequestData}
          pageCount={pageCount}
          canRowExpand={(val: any) => {
            if (val.values.propertyTypeId === 0) {
              return true;
            } else {
              return false;
            }
          }}
          detailsPanel={{
            render: val => {
              if (expandData[val.id]) {
                return <Buildings hideHeaders={true} data={expandData[val.id]} />;
              }
            },
            icons: {
              open: <FaFolderOpen color="black" size={20} />,
              closed: <FaFolder color="black" size={20} />,
            },
            checkExpanded: (row, state) => !!state.find(x => checkExpanded(x, row)),
            onExpand: loadBuildings,
            getRowId: row => row.id,
          }}
        />
      </div>
    </Container>
  );
};

export default PropertyListView;
