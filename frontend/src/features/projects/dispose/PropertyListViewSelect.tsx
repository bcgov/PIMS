import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { FormControlProps, Container, Button } from 'react-bootstrap';
import { useFormikContext, getIn } from 'formik';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { ILookupCode } from 'actions/lookupActions';
import { ILookupCodeState } from 'reducers/lookupCodeReducer';
import _ from 'lodash';
import { IFilterBarState, IProperty } from '.';
import * as API from 'constants/API';
import { DisplayError } from 'components/common/form';
import { getColumns } from './columns';
import { Table } from 'components/Table';
import useTable from './hooks/useTable';

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
  const { values, setFieldValue } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);

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

  const agencyIds = useMemo(() => agencies.map(x => parseInt(x.id, 10)), [agencies]);
  const columns = useMemo(() => getColumns(), []);

  // We'll start our table without any data
  const [data, setData] = useState<IProperty[]>([]);

  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState([] as IProperty[]);
  const [removedProperties, setRemovedProperties] = useState([] as IProperty[]);
  const [projectProperties, setProjectProperties] = useState(existingProperties);

  // const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const fetchData = useTable({ fetchIdRef, setData, setPageCount });

  // This will get called when the table needs new data
  const handleRequestData = useCallback(
    async ({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) => {
      setPageSize(pageSize);
      setPageIndex(pageIndex);
    },
    [setPageSize, setPageIndex],
  );

  //Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    fetchData({ pageIndex, pageSize, filter, agencyIds });
  }, [agencyIds, fetchData, filter, pageIndex, pageSize]);

  useEffect(() => {
    setFieldValue(field, projectProperties);
  }, [projectProperties, setFieldValue, field]);

  return (
    <Container className="col-md-12">
      {!disabled && (
        <div className="ScrollContainer">
          <Container fluid className="TableToolbar">
            <h3 className="mr-auto">Available Properties</h3>
            <Button
              onClick={() => {
                setProjectProperties(
                  _.uniqWith(
                    _.concat(selectedProperties, projectProperties),
                    (p1, p2) => p1.id === p2.id && p1.propertyTypeId === p2.propertyTypeId,
                  ),
                );
              }}
            >
              Add Selected
            </Button>
          </Container>
          <Table<IProperty>
            name="propertiesTable"
            columns={columns}
            data={data}
            lockPageSize
            pageSize={pageSize}
            onRequestData={handleRequestData}
            pageCount={pageCount}
            setSelectedRows={setSelectedProperties}
          />
        </div>
      )}
      <div className="ScrollContainer">
        <Container fluid className="TableToolbar">
          <h3 className="mr-auto">Properties in the Project</h3>
          <Button
            onClick={() => {
              setRemovedProperties([]);
              setProjectProperties(_.difference(projectProperties, removedProperties));
            }}
          >
            Remove Selected
          </Button>
        </Container>
        <Table<IProperty>
          name="propertiesTable"
          columns={columns}
          data={projectProperties}
          lockPageSize
          pageSize={-1}
          setSelectedRows={setRemovedProperties}
        />
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
