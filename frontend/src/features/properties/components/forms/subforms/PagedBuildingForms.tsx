import React, { useState, useRef, useMemo } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FieldArray, useFormikContext, FormikProps, getIn } from 'formik';
import BuildingForm, { defaultBuildingValues, IFormBuilding } from './BuildingForm';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { IFormParcel } from '../../../containers/ParcelDetailFormContainer';
import WrappedPaginate from 'components/common/WrappedPaginate';
import _ from 'lodash';
import { IPaginate } from 'utils/CommonFunctions';
import PaginatedFormErrors from './PaginatedFormErrors';
import GenericModal from 'components/common/GenericModal';
import { IBuilding } from 'actions/parcelsActions';
import { SelectOption } from 'components/common/form';
import TooltipWrapper from 'components/common/TooltipWrapper';

interface PagedBuildingFormsProps {
  /** controls whether this form can be interacted with */
  disabled?: boolean;
  allowEdit?: boolean;
}
const NUMBER_OF_EVALUATIONS_PER_PAGE = 1;

/**
 * Get the paginated page numbers that contain errors.
 */
const getPageErrors = (errors: any, nameSpace: any) => {
  const buildingErrors = getIn(errors, nameSpace);
  return _.reduce(
    buildingErrors,
    (acc: number[], error, index) => {
      if (error) {
        acc.push(parseInt(index) + 1);
      }
      return acc;
    },
    [],
  );
};

const deletePagedBuilding = (
  buildings: IFormBuilding[],
  currentPage: number,
  setCurrentPage: (n: number) => any,
  arrayHelpers: any,
) => {
  if (currentPage === buildings.length - 1) {
    setCurrentPage(currentPage - 1);
  }
  arrayHelpers.remove(currentPage);
};

/**
 * return a list of SelectOptions based on the passed reports, only returning dates older then the current report.
 */
const buildingsToBuildingOptions = (buildings: IBuilding[]) => {
  const options = _.map(
    buildings,
    (building: IBuilding, index: number) =>
      ({
        value: index,
        label: building.name?.length ? building.name : `Building #${index + 1}`,
      } as SelectOption),
  );
  options.unshift({
    value: '',
    label: 'Choose a building to view',
  });
  return options;
};

/**
 * PagedBuildingForms paginates all buildings within props.values.buildings.
 * @param props
 */
const PagedBuildingForms: React.FC<PagedBuildingFormsProps> = (props: PagedBuildingFormsProps) => {
  const formikProps: FormikProps<IFormParcel> = useFormikContext();
  const buildings: IFormBuilding[] = getIn(formikProps.values, 'buildings');
  const buildingsOptions = useMemo(() => buildingsToBuildingOptions(buildings), [buildings]);

  const pagedBuildings: IPaginate = {
    page: 0,
    total: buildings.length,
    quantity: NUMBER_OF_EVALUATIONS_PER_PAGE,
    items: _.range(0, buildings.length),
    maxPages: 15,
  };
  // the current paginated page.
  const [currentPage, setCurrentPage] = useState<number>(0);
  // to determine whether to show the delete confirmation popup
  const paginationRef = useRef();
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <FieldArray
        name="buildings"
        render={arrayHelpers => (
          <div className="buildingPaginate">
            {showDelete && (
              <GenericModal
                display={showDelete}
                cancelButtonText="Close"
                okButtonText="Delete"
                handleOk={() => {
                  deletePagedBuilding(buildings, currentPage, setCurrentPage, arrayHelpers);
                  setShowDelete(false);
                }}
                handleCancel={() => setShowDelete(false)}
                title="Confirmation of removal"
                message={
                  'Are you sure you would like to delete this building? You must click Submit to save your changes to the property.'
                }
              />
            )}
            {!props.disabled && !!props.allowEdit && (
              <TooltipWrapper toolTipId="add-building-tooltip" toolTip="Add a Building">
                <Button
                  className="pagedBuildingButton page-link"
                  title="Add Building"
                  variant="link"
                  disabled={props.disabled}
                  onClick={() => {
                    arrayHelpers.push({
                      ...defaultBuildingValues,
                      address: {
                        line1: formikProps.values.address?.line1,
                        line2: formikProps.values.address?.line2,
                        administrativeArea: formikProps.values.address?.administrativeArea,
                        province: formikProps.values.address?.province,
                        provinceId: 'BC',
                        postal: formikProps.values.address?.postal,
                      },
                      latitude: formikProps.values.latitude,
                      longitude: formikProps.values.longitude,
                    });
                    setCurrentPage(buildings.length);
                  }}
                >
                  <FaPlus size={20} />
                </Button>
              </TooltipWrapper>
            )}

            <WrappedPaginate
              pagingRef={paginationRef}
              onPageChange={(page: any) => setCurrentPage(page.selected)}
              {...pagedBuildings}
              maxPages={1}
              page={currentPage}
            />
            <Form.Group className="mr-auto">
              <Form.Control
                className="ml-4 input-medium"
                options={buildingsOptions}
                as="select"
                value={buildings?.length && currentPage}
                disabled={!buildings?.length}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCurrentPage(+e.target.value)
                }
              >
                {buildingsOptions.map((option: SelectOption) => (
                  <option key={option.value} value={option.value} className="option">
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {!props.disabled && !!props.allowEdit && (
              <TooltipWrapper toolTipId="building-delete-button" toolTip="Delete Building">
                <Button
                  className="delete-button page-link mr-4"
                  disabled={!buildings.length}
                  variant="link"
                  title="Remove Building"
                  onClick={() => {
                    formikProps.values.buildings[currentPage].id
                      ? setShowDelete(true)
                      : deletePagedBuilding(buildings, currentPage, setCurrentPage, arrayHelpers);
                  }}
                >
                  <FaTrash size={20} />
                </Button>
              </TooltipWrapper>
            )}
            <PaginatedFormErrors
              pagingRef={paginationRef}
              errors={getPageErrors(formikProps.errors, 'buildings')}
            />
          </div>
        )}
      />
      {!!buildings.length ? (
        <BuildingForm
          {...(formikProps as any)}
          disabled={props.disabled}
          allowEdit={props.allowEdit}
          nameSpace="buildings"
          index={currentPage}
        />
      ) : (
        <p>
          There are no Buildings associated to this Parcel.<br></br> Click '+' to add a Building
        </p>
      )}
    </>
  );
};

export default PagedBuildingForms;
