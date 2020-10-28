import React, { useState, useRef } from 'react';
import { Col, Button } from 'react-bootstrap';
import { FieldArray, useFormikContext, FormikProps, getIn } from 'formik';
import BuildingForm, { defaultBuildingValues, IFormBuilding } from './BuildingForm';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { IFormParcel } from '../ParcelDetailForm';
import WrappedPaginate from 'components/common/WrappedPaginate';
import _ from 'lodash';
import { IPaginate } from 'utils/CommonFunctions';
import PaginatedFormErrors from './PaginatedFormErrors';
import GenericModal from 'components/common/GenericModal';

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
 * PagedBuildingForms paginates all buildings within props.values.buildings.
 * @param props
 */
const PagedBuildingForms: React.FC<PagedBuildingFormsProps> = (props: PagedBuildingFormsProps) => {
  const formikProps: FormikProps<IFormParcel> = useFormikContext();
  const buildings: IFormBuilding[] = getIn(formikProps.values, 'buildings');

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
    <Col>
      <h3>Buildings</h3>
      <FieldArray
        name="buildings"
        render={arrayHelpers => (
          <div>
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
            <span className="buildingPaginate">
              {!props.disabled && !!props.allowEdit && (
                <>
                  <Button
                    className="pagedBuildingButton page-link"
                    variant="link"
                    disabled={props.disabled}
                    title="Add Building"
                    onClick={() =>
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
                      })
                    }
                  >
                    <FaPlus size={14} />
                  </Button>
                  <Button
                    className="pagedBuildingButton page-link"
                    disabled={!buildings.length}
                    variant="link"
                    title="Remove Building"
                    onClick={() => {
                      formikProps.values.buildings[currentPage].id
                        ? setShowDelete(true)
                        : deletePagedBuilding(buildings, currentPage, setCurrentPage, arrayHelpers);
                    }}
                  >
                    <FaTrash size={14} />
                  </Button>
                </>
              )}

              <WrappedPaginate
                pagingRef={paginationRef}
                onPageChange={(page: any) => setCurrentPage(page.selected)}
                {...pagedBuildings}
              />
            </span>
            {!!formikProps.values.buildings.length && <h4>Building Information</h4>}
            <PaginatedFormErrors
              pagingRef={paginationRef}
              errors={getPageErrors(formikProps.errors, 'buildings')}
            />
            <div>
              {!!buildings.length && (
                <BuildingForm
                  {...(formikProps as any)}
                  disabled={props.disabled}
                  allowEdit={props.allowEdit}
                  nameSpace="buildings"
                  index={currentPage}
                />
              )}
            </div>
          </div>
        )}
      />
    </Col>
  );
};

export default PagedBuildingForms;
