import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Formik, yupToFormErrors } from 'formik';
import { ParcelSchema } from 'utils/YupSchema';
import { defaultPidPinFormValues } from '../components/forms/subforms/PidPinForm';
import { defaultInformationFormValues } from '../components/forms/subforms/InformationForm';
import { IFormBuilding } from '../components/forms/subforms/BuildingForm';
import { defaultAddressValues } from '../components/forms/subforms/AddressForm';
import {
  defaultFinancials,
  filterEmptyFinancials,
  getMergedFinancials,
  IFinancial,
  IFinancialYear,
} from '../components/forms/subforms/EvaluationForm';
import { createParcel, updateParcel } from 'actionCreators/parcelsActionCreator';
import { Form } from 'components/common/form';

import { IParcel } from 'actions/parcelsActions';
import _ from 'lodash';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';
import { useApi } from 'hooks/useApi';
import { ParcelDetailTabs } from 'features/properties/containers/ParcelDetailContainer';
import { defaultLandValues } from '../components/forms/subforms/LandForm';
import { decimalOrUndefined } from 'utils';

interface IParcelPropertyProps {
  parcelDetail: IParcel | null;
  formikRef: any;
  agencyId?: number;
  persistCallback: (value: IParcel) => void;
}

export interface IFormParcel extends IParcel {
  financials: IFinancialYear[];
  buildings: IFormBuilding[];
}

/**
 * Create formiks initialValues by stitching together the default values provided by each subform.
 */
export const getInitialValues = (): any => {
  return {
    ...defaultPidPinFormValues,
    ...defaultLandValues,
    ...defaultInformationFormValues,
    latitude: '',
    longitude: '',
    address: defaultAddressValues,
    buildings: [],
    financials: defaultFinancials,
  };
};

/**
 * Do an in place conversion of all values to their expected API equivalents (eg. '' => undefined)
 * @param values the parcel value to convert.
 */
export const valuesToApiFormat = (values: IFormParcel): IFormParcel => {
  values.pin = values?.pin ? values.pin : undefined;
  values.pid = values?.pid ? values.pid : undefined;
  const seperatedFinancials = (_.flatten(
    values.financials?.map((financial: IFinancialYear) => _.values(financial)),
  ) ?? []) as IFinancial[];
  const allFinancials = filterEmptyFinancials(seperatedFinancials);

  values.evaluations = _.filter(allFinancials, financial =>
    Object.keys(EvaluationKeys).includes(financial.key),
  );
  values.fiscals = _.filter(allFinancials, financial =>
    Object.keys(FiscalKeys).includes(financial.key),
  );
  values.financials = [];
  values.buildings.forEach(building => {
    building.agencyId = building?.agencyId ? building.agencyId : values.agencyId;

    if (!building.leaseExpiry || !building.leaseExpiry.length) {
      building.leaseExpiry = undefined;
    }
    const seperatedBuildingFinancials = _.flatten(
      building.financials.map((financial: IFinancialYear) => _.values(financial)),
    ) as IFinancial[];
    building.buildingFloorCount = decimalOrUndefined(building.buildingFloorCount?.toString() ?? '');
    const allFinancials = filterEmptyFinancials(seperatedBuildingFinancials);
    building.evaluations = _.filter(allFinancials, financial =>
      Object.keys(EvaluationKeys).includes(financial.key),
    );
    building.fiscals = _.filter(allFinancials, financial =>
      Object.keys(FiscalKeys).includes(financial.key),
    );
    building.financials = [];
  });
  return values;
};

const ParcelDetailForm: React.FunctionComponent<IParcelPropertyProps> = ({
  formikRef,
  agencyId,
  parcelDetail,
  persistCallback,
  ...props
}) => {
  const dispatch = useDispatch();
  const api = useApi();

  let initialValues = getInitialValues();

  initialValues.agencyId = agencyId;
  //Load all data if we are updating a parcel.
  if (parcelDetail?.id) {
    const buildings = parcelDetail?.buildings.map(building => {
      return {
        ...building,
        financials: getMergedFinancials([...building.evaluations, ...building.fiscals]),
      };
    });

    initialValues = {
      ...parcelDetail,
      pid: parcelDetail.pid ?? '',
      pin: parcelDetail.pin ?? '',
      projectNumber: parcelDetail.projectNumber ?? '',
      financials: getMergedFinancials([...parcelDetail.evaluations, ...parcelDetail.fiscals]),
      buildings: buildings,
    };
  }

  /**
   * Combines yup validation with manual validation of financial data for performance reasons.
   * Large forms can take 3-4 seconds to validate with an all-yup validation schema.
   * This validation is significantly faster.
   * @param values formik form values to validate.
   */
  const handleValidate = async (values: IFormParcel) => {
    let financialErrors = {};

    const yupErrors: any = ParcelSchema.validate(values, { abortEarly: false }).then(
      () => {
        return financialErrors;
      },
      (err: any) => {
        return _.merge(yupToFormErrors(err), financialErrors);
      },
    );

    let pidDuplicated = false;
    if (values.pid && initialValues.pid !== values.pid) {
      pidDuplicated = !(await isPidAvailable(values));
    }

    let pinDuplicated = false;
    if (values.pin && initialValues.pin !== values.pin && values.pin.toString().length < 10) {
      pinDuplicated = !(await isPinAvailable(values));
    }

    let errors = await yupErrors;
    const { buildings: buildingErrors, tabs, ...parcelErrors } = errors;
    if (buildingErrors?.length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.buildings] };
    }
    if (parcelErrors && Object.keys(parcelErrors).length) {
      errors = { ...errors, tabs: [...(errors.tabs ?? []), ParcelDetailTabs.parcel] };
    }
    if (pidDuplicated) {
      errors = { ...errors, pid: 'This PID is already in use.' };
    }
    if (pinDuplicated) {
      errors = { ...errors, pin: 'This PIN is already in use.' };
    }
    return Promise.resolve(errors);
  };

  const isPidAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPidAvailable(values.id, values.pid);
    return response?.available;
  };

  const isPinAvailable = async (values: IFormParcel): Promise<boolean> => {
    const response = await api.isPinAvailable(values.id, values.pin);
    return response?.available;
  };

  return (
    <Row noGutters className="parcelDetailForm">
      <Col>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validateOnChange={false}
          validate={handleValidate}
          enableReinitialize={true}
          onSubmit={async (values, actions) => {
            const apiValues = valuesToApiFormat(_.cloneDeep(values));
            try {
              if (!values.id) {
                const data = await createParcel(apiValues)(dispatch);
                persistCallback(data);
              } else {
                await updateParcel(apiValues)(dispatch);
              }
            } catch (error) {
              //TODO: For now, swallow the exception.
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {() => <Form>{props.children}</Form>}
        </Formik>
      </Col>
    </Row>
  );
};

export default ParcelDetailForm;
