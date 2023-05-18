import classNames from 'classnames';
import { DisplayError } from 'components/common/form';
import { Table } from 'components/Table';
import { PropertyTypes } from 'constants/propertyTypes';
import { SidebarContextType } from 'features/mapSideBar/hooks/useQueryParamSideBar';
import { IProjectPropertyForm } from 'features/projects/disposals/interfaces';
import { useStepper } from 'features/projects/dispose';
import { IProperty } from 'features/projects/interfaces';
import { getIn, useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Container, FormControlProps } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { clickableTooltip } from '../../common';
import { getColumnsWithRemove, getPropertyColumns } from './columns';

type RequiredAttributes = {
  /** The field name */
  field: string;
};

type OptionalAttributes = {
  /** The form component label */
  label?: string;
  /** Short hint that describes the expected value of an <input> element */
  placeholder?: string;
  /** Adds a custom class to the input element of the <Input> component */
  className?: string;
  /** Specifies that the HTML element should be disabled */
  disabled?: boolean;
  /** Use React-Bootstrap's custom form elements to replace the browser defaults */
  custom?: boolean;
  /** className to apply to div wrapping the table component */
  outerClassName?: string;
  /** allows table rows to be selected using this function */
  setSelectedRows?: Function;
  /** makes the classification column editable */
  editableClassification?: boolean;
  /** makes the financial columns editable */
  editableFinancials?: boolean;
  /** makes the zoning columns editable */
  editableZoning?: boolean;
  /** limit the available classification labels that are returned */
  classificationLimitLabels?: string[];
  /** styles specific to ReviewApproveForm.tsx */
  useReviewApproveStyles?: boolean;
  /** used by ProjectProperties  */
  properties?: IProjectPropertyForm[];
};

// only "field" is required for <Input>, the rest are optional
export type InputProps = FormControlProps & OptionalAttributes & RequiredAttributes;

/**
 * Formik-connected Property List view allowing a list of properties to be updated.
 */
export const PropertyListViewUpdate: React.FC<InputProps> = ({
  field,
  outerClassName,
  disabled,
  setSelectedRows,
  editableClassification,
  editableFinancials,
  editableZoning,
  classificationLimitLabels,
  properties,
  useReviewApproveStyles,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const existingProperties: IProperty[] = getIn(values, field);
  const navigate = useNavigate();
  const { project } = useStepper();
  const columns = useMemo(
    () =>
      disabled
        ? getPropertyColumns({
            project,
            editableClassification: !disabled && editableClassification,
            editableFinancials: !disabled && editableFinancials,
            editableZoning: !disabled && editableZoning,
            limitLabels: classificationLimitLabels ?? [],
          })
        : getColumnsWithRemove({
            setProperties: (properties: IProperty) => setFieldValue('properties', properties),
            project,
            editableClassification: !disabled && editableClassification,
            editableFinancials: !disabled && editableFinancials,
            editableZoning: !disabled && editableZoning,
            limitLabels: classificationLimitLabels,
          }),
    [
      project,
      disabled,
      editableClassification,
      editableFinancials,
      editableZoning,
      classificationLimitLabels,
      setFieldValue,
    ],
  );
  const onRowClick = useCallback(
    (row: IProperty) => {
      const queryParams = new URLSearchParams();
      const propertyInfo = properties
        ? properties.find((p: IProjectPropertyForm) => p.id === row.id)
        : undefined;
      queryParams.set('sidebar', 'true');
      queryParams.set('disabled', 'true');
      queryParams.set('loadDraft', 'false');
      queryParams.set(
        'buildingId',
        `${row.propertyTypeId === PropertyTypes.BUILDING ? propertyInfo?.propertyId : undefined}`,
      );
      queryParams.set(
        'parcelId',
        `${
          [PropertyTypes.PARCEL, PropertyTypes.SUBDIVISION].includes(row.propertyTypeId)
            ? propertyInfo?.propertyId
            : undefined
        }`,
      );
      queryParams.set('sidebarContext', `${SidebarContextType.ADD_PROPERTY_TYPE_SELECTOR}`);
      queryParams.set('sidebarSize', 'wide');
      navigate({
        pathname: '/mapview',
        search: queryParams.toString(),
      });
    },
    [properties, navigate],
  );

  return (
    <Container fluid>
      <div className={classNames('ScrollContainer', outerClassName)}>
        <div style={{ marginLeft: useReviewApproveStyles ? '-25px' : 0 }}>
          <Table<IProperty, any>
            name="UpdatePropertiesTable"
            columns={columns}
            data={existingProperties}
            pageSize={-1}
            clickableTooltip={clickableTooltip}
            lockPageSize
            setSelectedRows={setSelectedRows}
            footer
            onRowClick={onRowClick}
          />
        </div>
      </div>
      <DisplayError field={field} />
    </Container>
  );
};
