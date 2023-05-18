import { IParcel } from 'actions/parcelsActions';
import { DisplayError, Input } from 'components/common/form';
import SearchButton from 'components/common/form/SearchButton';
import { ISteppedFormValues } from 'components/common/form/StepForm';
import { Label } from 'components/common/Label';
import { ILinkListItem, LinkList } from 'components/common/LinkList';
import { dequal } from 'dequal';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import { getIn, useFormikContext } from 'formik';
import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { withNameSpace } from 'utils/formUtils';

import { ISearchFields } from '../LandForm';

interface IAddParentParcelsFormProps {
  /** used for determining nameSpace of field */
  nameSpace?: any;
  /** Function that searches for a parcel matching a pid within the API */
  findMatchingPid?: (pid: string, nameSpace?: string | undefined) => Promise<IParcel | undefined>;
  /** whether or not the fields on this form can be interacted with */
  disabled?: boolean;
}

const ErrorMessage = styled(DisplayError)`
  display: block !important;
`;

/**
 * Component that displays a search field that searches and adds valid pids, and allows the user to manage this list.
 * @param {IAddParentParcelsFormProps} param0
 */
const AddParentParcelsForm = ({
  nameSpace,
  findMatchingPid,
  disabled,
}: IAddParentParcelsFormProps) => {
  const { values, initialValues, touched, setFieldValue, setFieldTouched } =
    useFormikContext<ISteppedFormValues<IParcel & ISearchFields>>();
  const location = useLocation();
  const parcels = getIn(values, withNameSpace(nameSpace, 'parcels'));
  const initialParcels = getIn(initialValues, withNameSpace(nameSpace, 'parcels'));
  const touch = getIn(touched, withNameSpace(nameSpace, 'parcels'));

  const linkListItems = useMemo<ILinkListItem[]>(
    () =>
      parcels.map((parcel: IParcel): ILinkListItem => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('sidebar', 'true');
        queryParams.set('disabled', 'true');
        queryParams.set('loadDraft', 'false');
        queryParams.set('parcelId', `${parcel.id}`);
        return {
          key: parcel.id,
          label: `PID ${pidFormatter(parcel.pid ?? '')}`,
          pathName: '/mapview',
          onRemoveItemClick: () =>
            setFieldValue(
              withNameSpace(nameSpace, 'parcels'),
              parcels.filter((p: IParcel) => p.id !== parcel.id),
            ),
          removeItemTitle: 'Click to remove Parent Parcel Association',
          search: queryParams.toString(),
        };
      }),
    [location.search, nameSpace, parcels, setFieldValue],
  );

  useEffect(() => {
    if (!dequal(initialParcels, parcels)) {
      setFieldTouched(withNameSpace(nameSpace, 'parcels') || touch);
    }
  }, [initialParcels, nameSpace, parcels, setFieldTouched, touch]);
  return (
    <>
      <Col md={12}>
        <h5>Parent Parcels</h5>
      </Col>
      <Col md={12}>
        <Row style={{ alignItems: 'center' }}>
          <Col md="auto">
            <Label>Enter Parent Parcel PID(s)</Label>
          </Col>
          <Col md="auto">
            <Input
              displayErrorTooltips
              className="input-small"
              disabled={disabled}
              pattern={RegExp(/^[\d\- ]*$/)}
              onBlurFormatter={(pid: string) => {
                if (pid?.length > 0) {
                  return pid.replace(pid, pidFormatter(pid));
                }
                return '';
              }}
              field={withNameSpace(nameSpace, 'searchParentPid')}
            />
          </Col>
          <Col md="auto">
            <SearchButton
              data-testid="search-button"
              disabled={disabled}
              onClick={async (e: any) => {
                e.preventDefault();
                if (findMatchingPid) {
                  const pid = getIn(values, withNameSpace(nameSpace, 'searchParentPid'));
                  const loadingToast = toast.dark(`Searching for parcel...`);
                  const matchingParcel = await findMatchingPid(pid, nameSpace);
                  toast.dismiss(loadingToast);
                  if (!!matchingParcel) {
                    setFieldValue(
                      withNameSpace(nameSpace, 'parcels'),
                      _.uniqBy(
                        [...getIn(values, withNameSpace(nameSpace, 'parcels')), matchingParcel],
                        'id',
                      ),
                    );
                  } else {
                    toast.error(
                      "enter a PID for a property that is already in the PIMS Inventory. If it is not you'll need to add it to PIMS first before trying to create a subdivision from it.",
                      {
                        autoClose: false,
                      },
                    );
                  }
                }
              }}
            />
          </Col>
        </Row>
      </Col>
      <Col md={12}>
        <hr></hr>
        <LinkList noItemsMessage="No Associated Parent Parcels" listItems={linkListItems} />
        <ErrorMessage field={withNameSpace(nameSpace, 'parcels')} />
        <hr></hr>
      </Col>
    </>
  );
};
export default AddParentParcelsForm;
