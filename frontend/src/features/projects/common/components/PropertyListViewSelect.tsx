import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { FormControlProps, Container, Button } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import _ from 'lodash';
import { IFilterBarState, IProperty, clickableTooltip, useProject } from '../../common';
import * as API from 'constants/API';
import { DisplayError } from 'components/common/form';
import { Table } from 'components/Table';
import useTable from '../../dispose/hooks/useTable';
import { getPropertyColumns, getColumnsWithRemove } from './columns';
import queryString from 'query-string';
import { PropertyTypes } from 'constants/propertyTypes';
import useCodeLookups from 'hooks/useLookupCodes';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';

type RequiredAttributes = {
  /** The field name */
  field: string;
};

type OptionalAttributes = {
  /** The form component label */
  label?: string;
  /** The underlying HTML element to use when rendering the FormControl */
  as?: React.ElementType;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  outerClassName?: string;
  filter: IFilterBarState;
  pageIndex: number;
  setPageIndex: Function;
};

// only "field" is required for <Input>, the rest are optional
export type InputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected Property List view allowing multiple properties to be selected/removed
 */
export const PropertyListViewSelect: React.FC<InputProps> = ({
  field,
  disabled,
  filter,
  pageIndex,
  setPageIndex,
}) => {
  const lookupCodes = useCodeLookups();
  const { values, setFieldValue } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);

  const agencies = useMemo(() => lookupCodes.getByType(API.AGENCY_CODE_SET_NAME), [lookupCodes]);
  const { project } = useProject();
  const filterByParent = useCodeLookups().filterByParent;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredAgencies = useMemo(() => filterByParent(agencies, project.agencyId), [agencies]);

  const agencyIds = useMemo(() => filteredAgencies.map(x => parseInt(x.id, 10)), [
    filteredAgencies,
  ]);
  if (project === undefined) {
    throw Error('unable to load project data');
  }
  const columns = useMemo(() => getPropertyColumns({ project: project }), [project]);

  // We'll start our table without any data
  const [data, setData] = useState<IProperty[]>([]);

  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState([] as IProperty[]);
  const [removedProperties, setRemovedProperties] = useState([] as IProperty[]);
  const [properties, setProjectProperties] = useState(existingProperties);
  const columnsWithRemove = useMemo(
    () => getColumnsWithRemove({ setProperties: setProjectProperties, project: project as any }),
    [project],
  );

  const onPageSizeChanged = useCallback(size => {
    setPageSize(size);
  }, []);

  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const fetchData = useTable({ fetchIdRef, setData, setPageCount, setLoading });

  // This will get called when the table needs new data
  const handleRequestData = useCallback(
    async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
      setLoading(true);
    },
    [setPageSize, setPageIndex],
  );

  //Listen for changes in pagination and use the state to fetch our new data
  useDeepCompareEffect(() => {
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [agencyIds, fetchData, filter, pageIndex, pageSize]);

  useEffect(() => {
    setFieldValue(field, properties);
  }, [properties, setFieldValue, field]);

  const onRowClick = useCallback((row: IProperty) => {
    window.open(
      `/mapview?${queryString.stringify({
        sidebar: true,
        disabled: true,
        loadDraft: false,
        parcelId: [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(row.propertyTypeId)
          ? row.id
          : undefined,
        buildingId: row.propertyTypeId === PropertyTypes.BUILDING ? row.id : undefined,
      })}`,
      '_blank',
    );
  }, []);

  return (
    <Container className="col-md-12 PropertyListViewSelect">
      {!disabled && (
        <div className="ScrollContainer">
          <h2>Available Properties</h2>
          <Table<IProperty>
            name="SelectPropertiesTable"
            columns={columns}
            data={data}
            pageSizeMenuDropUp
            pageSize={pageSize}
            onRequestData={handleRequestData}
            pageCount={pageCount}
            pageIndex={pageIndex}
            selectedRows={selectedProperties}
            setSelectedRows={setSelectedProperties}
            clickableTooltip={clickableTooltip}
            onRowClick={onRowClick}
            onPageSizeChange={onPageSizeChanged}
            loading={loading}
          />
          <Container fluid className="TableToolbar">
            <strong className="align-self-center mr-2">
              {!!selectedProperties.length ? `${selectedProperties.length} Selected` : ''}
            </strong>
            <Button
              variant="secondary"
              onClick={() => {
                setProjectProperties(
                  _.uniqWith(
                    _.concat(selectedProperties, properties),
                    (p1, p2) => p1.id === p2.id && p1.propertyTypeId === p2.propertyTypeId,
                  ),
                );
              }}
            >
              Add To Project
            </Button>
          </Container>
        </div>
      )}
      <div className="ScrollContainer">
        <Container fluid className="TableToolbar">
          <h2 className="mr-auto">Properties in the Project</h2>
          <Button
            onClick={() => {
              setRemovedProperties([]);
              setProjectProperties(_.difference(properties, removedProperties));
            }}
          >
            Remove Selected
          </Button>
        </Container>
        <Table<IProperty>
          name="ProjectPropertiesTable"
          columns={columnsWithRemove}
          data={properties ?? []}
          lockPageSize
          pageSize={-1}
          setSelectedRows={setRemovedProperties}
          clickableTooltip={clickableTooltip}
          onRowClick={onRowClick}
          footer
        />
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
