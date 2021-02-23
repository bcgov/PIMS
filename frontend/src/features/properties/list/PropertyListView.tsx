import './PropertyListView.scss';
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Button } from 'react-bootstrap';
import queryString from 'query-string';
import { isEmpty } from 'lodash';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import { decimalOrUndefined, mapLookupCode } from 'utils';
import download from 'utils/download';
import { IPropertyQueryParams, IProperty } from '.';
import { columns as cols } from './columns';
import { Table } from 'components/Table';
import service from '../service';
import { FaFolderOpen, FaFolder, FaEdit, FaFileExport } from 'react-icons/fa';
import { Buildings } from './buildings';
import { FaFileExcel, FaFileAlt } from 'react-icons/fa';
import styled from 'styled-components';
import TooltipWrapper from 'components/common/TooltipWrapper';
import { ReactComponent as BuildingSvg } from 'assets/images/icon-business.svg';
import { ReactComponent as LandSvg } from 'assets/images/icon-lot.svg';
import { PropertyFilter } from '../filter';
import { PropertyTypeNames } from '../../../constants/propertyTypeNames';
import { IPropertyFilter } from '../filter/IPropertyFilter';
import { SortDirection, TableSort } from 'components/Table/TableSort';
import { useRouterFilter } from 'hooks/useRouterFilter';
import { Form, Formik, FormikProps, getIn, useFormikContext } from 'formik';
import {
  getCurrentFiscal,
  getMostRecentEvaluation,
  toApiProperty,
} from 'features/projects/common/projectConverter';
import { useApi } from 'hooks/useApi';
import { toast } from 'react-toastify';
import { IApiProperty } from 'features/projects/common';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import variables from '_variables.module.scss';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { Roles } from 'constants/roles';
import useCodeLookups from 'hooks/useLookupCodes';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

const getPropertyReportUrl = (filter: IPropertyQueryParams) =>
  `${ENVIRONMENT.apiUrl}/reports/properties?${filter ? queryString.stringify(filter) : ''}`;

const getAllFieldsPropertyReportUrl = (filter: IPropertyQueryParams) =>
  `${ENVIRONMENT.apiUrl}/reports/properties/all/fields?${
    filter ? queryString.stringify(filter) : ''
  }`;

const FileIcon = styled(Button)`
  background-color: #fff !important;
  color: ${variables.primaryColor} !important;
  padding: 6px 5px;
`;

const EditIconButton = styled(FileIcon)`
  margin-right: 12px;
`;

const VerticalDivider = styled.div`
  border-left: 6px solid rgba(96, 96, 96, 0.2);
  height: 40px;
  margin-left: 1%;
  margin-right: 1%;
  border-width: 2px;
`;

const initialQuery: IPropertyQueryParams = {
  page: 1,
  quantity: 10,
  agencies: [],
};

const defaultFilterValues: IPropertyFilter = {
  searchBy: 'address',
  pid: '',
  address: '',
  administrativeArea: '',
  name: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  rentableArea: '',
  propertyType: PropertyTypeNames.Land,
  maxAssessedValue: '',
  maxNetBookValue: '',
  maxMarketValue: '',
  surplusFilter: false,
};

export const flattenProperty = (apiProperty: IApiProperty): IProperty => {
  const assessedLand = getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Assessed);
  const assessedBuilding = apiProperty.parcelId
    ? getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Improvements)
    : getMostRecentEvaluation(apiProperty.evaluations, EvaluationKeys.Assessed);
  const netBook = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.NetBook);
  const market = getCurrentFiscal(apiProperty.fiscals, FiscalKeys.Market);
  const property: any = {
    id: apiProperty.id,
    parcelId: apiProperty.parcelId ?? apiProperty.id,
    pid: apiProperty.pid ?? '',
    name: apiProperty.name,
    description: apiProperty.description,
    landLegalDescription: apiProperty.landLegalDescription,
    zoning: apiProperty.zoning,
    zoningPotential: apiProperty.zoningPotential,
    isSensitive: apiProperty.isSensitive,
    latitude: apiProperty.latitude,
    longitude: apiProperty.longitude,
    agencyId: apiProperty.agencyId,
    agency: apiProperty.agency ?? '',
    agencyCode: apiProperty.agency ?? '',
    subAgency: apiProperty.subAgency,
    classification: apiProperty.classification ?? '',
    classificationId: apiProperty.classificationId,
    addressId: apiProperty.address?.id as number,
    address: `${apiProperty.address?.line1 ?? ''} , ${apiProperty.address?.administrativeArea ??
      ''}`,
    administrativeArea: apiProperty.address?.administrativeArea ?? '',
    province: apiProperty.address?.province ?? '',
    postal: apiProperty.address?.postal ?? '',
    assessedLand: (assessedLand?.value as number) ?? 0,
    assessedLandDate: assessedLand?.date,
    assessedBuilding: (assessedBuilding?.value as number) ?? 0,
    assessedBuildingDate: assessedBuilding?.date,
    assessedFirm: assessedLand?.firm,
    assessedRowVersion: assessedLand?.rowVersion,
    netBook: (netBook?.value as number) ?? 0,
    netBookFiscalYear: netBook?.fiscalYear as number,
    netBookRowVersion: netBook?.rowVersion,
    market: (market?.value as number) ?? 0,
    marketFiscalYear: market?.fiscalYear as number,
    marketRowVersion: market?.rowVersion,
    rowVersion: apiProperty.rowVersion,
    landArea: apiProperty.landArea,
  };
  return property;
};

/**
 * Get the server query
 * @param state - Table state
 */
const getServerQuery = (state: {
  pageIndex: number;
  pageSize: number;
  filter: IPropertyFilter;
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
      inSurplusPropertyProgram,
      inEnhancedReferralProcess,
      bareLandOnly,
      name,
      agencies,
      minLotSize,
      maxLotSize,
      propertyType,
    },
  } = state;

  let parsedAgencies: number[] = [];
  if (agencies !== null && agencies !== undefined && agencies !== '') {
    parsedAgencies = Array.isArray(agencies)
      ? (agencies as any).map((a: any) => {
          return parseInt(a.value, 10);
        })
      : [parseInt(agencies, 10)];
  }

  const query: IPropertyQueryParams = {
    ...initialQuery,
    address,
    pid,
    administrativeArea,
    projectNumber,
    classificationId: decimalOrUndefined(classificationId),
    agencies: parsedAgencies,
    minLandArea: decimalOrUndefined(minLotSize),
    maxLandArea: decimalOrUndefined(maxLotSize),
    inSurplusPropertyProgram: inSurplusPropertyProgram,
    inEnhancedReferralProcess: inEnhancedReferralProcess,
    bareLandOnly: bareLandOnly,
    page: pageIndex + 1,
    quantity: pageSize,
    propertyType: propertyType,
    name: name,
  };
  return query;
};

interface IChangedRow {
  rowId: number;
  assessedLand?: boolean;
  assessedBuilding?: boolean;
  netBook?: boolean;
  market?: boolean;
}

/**
 *  Component to track edited rows in the formik table
 * @param param0 {setDirtyRows: event listener for changed rows}
 */
const DirtyRowsTracker: React.FC<{ setDirtyRows: (changes: IChangedRow[]) => void }> = ({
  setDirtyRows,
}) => {
  const { touched, isSubmitting } = useFormikContext();

  React.useEffect(() => {
    if (!!touched && !isEmpty(touched) && !isSubmitting) {
      const changed = Object.keys(getIn(touched, 'properties')).map(key => ({
        rowId: Number(key),
        ...getIn(touched, 'properties')[key],
      }));
      setDirtyRows(changed);
    }
  }, [touched, setDirtyRows, isSubmitting]);

  return null;
};

const PropertyListView: React.FC = () => {
  const lookupCodes = useCodeLookups();
  const { updateBuilding, updateParcel } = useApi();
  const [editable, setEditable] = useState(false);
  const tableFormRef = useRef<FormikProps<{ properties: IProperty[] }> | undefined>();
  const [dirtyRows, setDirtyRows] = useState<IChangedRow[]>([]);
  const keycloak = useKeycloakWrapper();
  const municipalities = useMemo(
    () => lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME),
    [lookupCodes],
  );
  const agencies = useMemo(() => lookupCodes.getByType(API.AGENCY_CODE_SET_NAME), [lookupCodes]);

  const agenciesList = agencies.filter(a => !a.parentId).map(mapLookupCode);
  const subAgencies = agencies.filter(a => !!a.parentId).map(mapLookupCode);

  const propertyClassifications = useMemo(() => lookupCodes.getPropertyClassificationOptions(), [
    lookupCodes,
  ]);
  const administrativeAreas = useMemo(
    () => lookupCodes.getByType(API.AMINISTRATIVE_AREA_CODE_SET_NAME),
    [lookupCodes],
  );

  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
  const [sorting, setSorting] = useState<TableSort<IProperty>>({ description: 'asc' });

  // We'll start our table without any data
  const [data, setData] = useState<IProperty[] | undefined>();
  // For getting the buildings on parcel folder click
  const [expandData, setExpandData] = useState<any>({});

  // Filtering and pagination state
  const [filter, setFilter] = useState<IPropertyFilter>(defaultFilterValues);
  const columns = useMemo(
    () =>
      cols(
        agenciesList,
        subAgencies,
        municipalities,
        propertyClassifications,
        !filter || filter.propertyType === 'Land' ? 0 : 1,
        editable,
      ),
    [subAgencies, agenciesList, municipalities, propertyClassifications, editable, filter],
  );

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const fetchIdRef = useRef(0);

  const parsedFilter = useMemo(() => {
    const data = { ...filter };
    if (data.agencies) {
      data.agencies = Array.isArray(data.agencies)
        ? (data.agencies as any).map((a: any) => {
            return parseInt(a.value, 10);
          })
        : [parseInt(data.agencies, 10)];
    }

    return data;
  }, [filter]);

  useRouterFilter({ filter: parsedFilter, setFilter: null, key: 'propertyFilter' });

  // Update internal state whenever the filter bar state changes
  const handleFilterChange = useCallback(
    async (value: IPropertyFilter) => {
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
      sorting,
    }: {
      pageIndex: number;
      pageSize: number;
      filter: IPropertyFilter;
      agencyIds: number[];
      sorting: TableSort<IProperty>;
    }) => {
      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // TODO: Set the loading state
      // setLoading(true);

      // Only update the data if this is the latest fetch
      if (agencyIds?.length > 0) {
        setData(undefined);
        const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
        const data = await service.getPropertyList(query, sorting);
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
  useDeepCompareEffect(() => {
    fetchData({ pageIndex, pageSize, filter, agencyIds, sorting });
  }, [fetchData, pageIndex, pageSize, filter, agencyIds, sorting]);

  const dispatch = useDispatch();

  /**
   * @param {'csv' | 'excel'} accept Whether the fetch is for type of CSV or EXCEL
   * @param {boolean} getAllFields Enable this field to generate report with additional fields. For SRES only.
   */
  const fetch = (accept: 'csv' | 'excel', getAllFields?: boolean) => {
    const query = getServerQuery({ pageIndex, pageSize, filter, agencyIds });
    return dispatch(
      download({
        url: getAllFields
          ? getAllFieldsPropertyReportUrl({ ...query, all: true, propertyType: undefined })
          : getPropertyReportUrl({ ...query, all: true, propertyType: undefined }),
        fileName: `pims-inventory.${accept === 'csv' ? 'csv' : 'xlsx'}`,
        actionType: 'properties-report',
        headers: {
          Accept: accept === 'csv' ? 'text/csv' : 'application/vnd.ms-excel',
        },
      }),
    );
  };

  const checkExpanded = (row: IProperty, property: IProperty) => {
    return row.id === property.id;
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

  const changePropertyType = (type: PropertyTypeNames) => {
    setPageIndex(0);
    setFilter(state => {
      return {
        ...state,
        propertyType: type,
      };
    });
  };

  const appliedFilter = { ...filter };
  if (appliedFilter.agencies && typeof appliedFilter.agencies === 'string') {
    const agencySelections = agencies.map(mapLookupCode);
    appliedFilter.agencies = filter.agencies
      .split(',')
      .map(value => agencySelections.find(agency => agency.value === value) || '') as any;
  }

  return (
    <Container fluid className="PropertyListView">
      <Container fluid className="filter-container border-bottom">
        <Container className="px-0">
          <PropertyFilter
            defaultFilter={defaultFilterValues}
            agencyLookupCodes={agencies}
            adminAreaLookupCodes={administrativeAreas}
            onChange={handleFilterChange}
            sort={sorting}
            onSorting={setSorting}
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
                    filter.propertyType === PropertyTypeNames.Land ? 'svg-btn active' : 'svg-btn'
                  }
                  onClick={() => changePropertyType(PropertyTypeNames.Land)}
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
                    filter.propertyType === PropertyTypeNames.Building
                      ? 'svg-btn active'
                      : 'svg-btn'
                  }
                  onClick={() => changePropertyType(PropertyTypeNames.Building)}
                >
                  <BuildingSvg className="svg" />
                  Buildings view
                </div>
              </TooltipWrapper>
            </div>
          </div>
          <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to Excel">
            <FileIcon>
              <FaFileExcel data-testid="excel-icon" size={36} onClick={() => fetch('excel')} />
            </FileIcon>
          </TooltipWrapper>
          <TooltipWrapper toolTipId="export-to-excel" toolTip="Export to CSV">
            <FileIcon>
              <FaFileAlt data-testid="csv-icon" size={36} onClick={() => fetch('csv')} />
            </FileIcon>
          </TooltipWrapper>
          {(keycloak.hasRole(Roles.SRES_FINANCIAL_MANAGER) || keycloak.hasRole(Roles.SRES)) && (
            <TooltipWrapper toolTipId="export-to-excel" toolTip="Export all properties and fields">
              <FileIcon>
                <FaFileExport
                  data-testid="file-icon"
                  size={36}
                  onClick={() => fetch('excel', true)}
                />
              </FileIcon>
            </TooltipWrapper>
          )}
          <VerticalDivider />

          <TooltipWrapper toolTipId="edit-financial-values" toolTip={'Edit financial values'}>
            <EditIconButton>
              <FaEdit data-testid="edit-icon" size={36} onClick={() => setEditable(!editable)} />
            </EditIconButton>
          </TooltipWrapper>
          {editable && (
            <TooltipWrapper
              toolTipId="save-edited-financial-values"
              toolTip={'Save financial values'}
            >
              <Button
                data-testid="save-changes"
                disabled={dirtyRows.length === 0}
                onClick={() => {
                  if (tableFormRef.current?.dirty) {
                    tableFormRef.current.submitForm();
                  }
                }}
              >
                Save edits
              </Button>
            </TooltipWrapper>
          )}
        </Container>
        <Formik
          innerRef={tableFormRef as any}
          initialValues={{ properties: data || [] }}
          enableReinitialize
          onSubmit={async values => {
            let nextProperties = [...values.properties];
            const changedRows = dirtyRows.map(change => {
              const data = { ...values.properties![change.rowId] };

              return { rowId: change.rowId, data } as any;
            });
            if (changedRows.length > 0) {
              for (const change of changedRows) {
                const apiProperty = toApiProperty(change.data as any, true);
                const callApi = apiProperty.parcelId ? updateParcel : updateBuilding;
                const response: any = await callApi(apiProperty.id, apiProperty);
                nextProperties = nextProperties.map((item, index: number) => {
                  if (index === change.rowId) {
                    item = {
                      ...item,
                      ...flattenProperty(response),
                    } as any;
                  }
                  return item;
                });
              }

              toast.info('Successfully saved changes');
              setDirtyRows([]);
              setData(nextProperties);
            }
          }}
        >
          <Form>
            <DirtyRowsTracker setDirtyRows={setDirtyRows} />
            <Table<IProperty>
              name="propertiesTable"
              lockPageSize={true}
              columns={columns}
              data={data || []}
              loading={data === undefined}
              filterable
              sort={sorting}
              pageIndex={pageIndex}
              onRequestData={handleRequestData}
              pageCount={pageCount}
              onSortChange={(column: string, direction: SortDirection) => {
                if (!!direction) {
                  setSorting({ ...sorting, [column]: direction });
                } else {
                  const data: any = { ...sorting };
                  delete data[column];
                  setSorting(data);
                }
              }}
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
              filter={appliedFilter}
              onFilterChange={values => {
                setFilter({ ...filter, ...values });
              }}
            />
          </Form>
        </Formik>
      </div>
    </Container>
  );
};

export default PropertyListView;
