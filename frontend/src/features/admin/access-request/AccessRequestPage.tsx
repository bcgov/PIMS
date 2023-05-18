import './AccessRequestPage.scss';

import { ILookupCode } from 'actions/ILookupCode';
import { Form, Input, Select, SelectOption, TextArea } from 'components/common/form';
import { ISnackbarState, Snackbar } from 'components/common/Snackbar';
import { AccessRequestStatus } from 'constants/accessStatus';
import * as API from 'constants/API';
import { DISCLAIMER_URL, PRIVACY_POLICY_URL } from 'constants/strings';
import { AUTHORIZATION_URL } from 'constants/strings';
import { Formik, FormikHelpers } from 'formik';
import useKeycloakWrapper, { IKeycloak } from 'hooks/useKeycloakWrapper';
import useCodeLookups from 'hooks/useLookupCodes';
import { IAccessRequest } from 'interfaces';
import React, { useEffect } from 'react';
import { Alert, Button, ButtonToolbar, Col, Container, Row } from 'react-bootstrap';
import { useAppSelector } from 'store';
import { toAccessRequest, useAccessRequest } from 'store/slices/hooks';
import { mapLookupCode } from 'utils';
import { convertToGuidFormat } from 'utils/formatGuid';
import { AccessRequestSchema } from 'utils/YupSchema';

interface IAccessRequestForm extends IAccessRequest {
  agency: number;
  role: string;
}

/**
 * The AccessRequestPage provides a way to new authenticated users to submit a request
 * that associates them with a specific agency and a role within the agency.
 * If they have an active access request already submitted, it will allow them to update it until it has been approved or disabled.
 * If their prior request was disabled they will then be able to submit a new request.
 *
 * @returns {JSX.Element}
 */
const AccessRequestPage = (): JSX.Element => {
  const keycloakWrapper: IKeycloak = useKeycloakWrapper();
  const api: any = useAccessRequest();
  const [alert, setAlert] = React.useState<ISnackbarState>({});

  useEffect(() => {
    api.getCurrentAccessRequestAction();
  }, [api]);

  const { getByType, getPublicByType } = useCodeLookups();
  const agencies: ILookupCode[] = getByType(API.AGENCY_CODE_SET_NAME);
  const roles: ILookupCode[] = getPublicByType(API.ROLE_CODE_SET_NAME);

  // Fetch the user's accessRequest if it exists
  const accessRequest: IAccessRequest | null = useAppSelector(
    (store) => store.accessRequest.accessRequest,
  );

  const initialValues: IAccessRequestForm = {
    id: accessRequest?.id ?? 0,
    userId: convertToGuidFormat(keycloakWrapper.userId),
    user: {
      id: keycloakWrapper.userId,
      username: keycloakWrapper.username,
      displayName: keycloakWrapper.displayName ?? '',
      firstName: keycloakWrapper.firstName ?? '',
      lastName: keycloakWrapper.lastName ?? 'test',
      email: keycloakWrapper.email,
      position: accessRequest?.user?.position ?? keycloakWrapper.obj?.position ?? '',
    },
    agencies: accessRequest?.agencies ?? [],
    status: accessRequest?.status || AccessRequestStatus.OnHold,
    roles: accessRequest?.roles ?? [],
    note: accessRequest?.note ?? '',
    agency: accessRequest?.agencies?.find((x) => x).id,
    role: accessRequest?.roles?.find((x) => x).id,
    rowVersion: accessRequest?.rowVersion,
  };

  const selectAgencies: SelectOption[] = agencies.map((c) =>
    mapLookupCode(c, initialValues.agency),
  );
  const selectRoles: SelectOption[] = roles.map((c) => mapLookupCode(c, initialValues.role));

  const button = initialValues.id === 0 ? 'Submit' : 'Update';
  const inProgress = React.useMemo(
    () =>
      initialValues.id !== 0 ? (
        <Alert key={initialValues.id} variant="primary">
          You will receive an email when your request is reviewed.
        </Alert>
      ) : null,
    [initialValues.id],
  );

  /**
   *
   * @param {IAccessRequestForm} values - The values of the Access Request Form
   * @param {FormikHelpers<IAccessRequestForm>} actions - Formik actions to affect the form
   * @inheritdoc
   */
  const handleFormSubmit = async (
    values: IAccessRequestForm,
    actions: FormikHelpers<IAccessRequestForm>,
  ) => {
    try {
      await api.getSubmitAccessRequestAction(toAccessRequest(values));
      setAlert({
        variant: 'success',
        message: 'Your request has been submitted.',
        show: true,
      });
    } catch (error) {
      setAlert({
        variant: 'danger',
        message: 'Failed to submit your access request.',
        show: true,
      });
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="accessRequestPage">
      <h1 className="accessRequestPage-header">Access Request</h1>
      <Container fluid={true} className="userInfo">
        <Row className="justify-content-md-center ml-0 mr-0">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={AccessRequestSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {inProgress}
                {/* 
              {/* 
                {/* 
                Displaying the user's autofilled data 
              */}
                <Row>
                  <Col xs={4}>
                    <Form.Label>IDIR/BCeID</Form.Label>
                    <h5>{initialValues.user.username}</h5>
                  </Col>

                  <Col xs={{ span: 4, offset: 4 }}>
                    <Form.Label>Email</Form.Label>
                    <h5>{initialValues.user.email}</h5>
                  </Col>
                </Row>

                <Row>
                  <Col xs={4}>
                    <Form.Label>First Name</Form.Label>
                    <h5>{initialValues.user.firstName}</h5>
                  </Col>

                  <Col xs={{ span: 4, offset: 4 }}>
                    <Form.Label>Last Name</Form.Label>
                    <h5>{initialValues.user.lastName}</h5>
                  </Col>
                </Row>

                {/* Start of user input */}

                <Form.Group as={Row}>
                  <Col xs={12}>
                    <Form.Label>Agency</Form.Label>
                    <Select
                      className="agency-selector"
                      outerClassName="mx-0"
                      field="agency"
                      required={true}
                      options={selectAgencies}
                      placeholder={
                        initialValues?.agencies?.length > 0 ? undefined : 'Select an agency'
                      }
                    />
                  </Col>
                </Form.Group>

                <Row>
                  <Col xs={12}>
                    <Form.Label>Position</Form.Label>
                    <Input
                      field="user.position"
                      placeholder="e.g Director, Real Estate and Stakeholder Engagement"
                      type="text"
                      outerClassName="position-input mx-0"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <Form.Label>
                      Role&nbsp;
                      <a target="_blank" rel="noopener noreferrer" href={AUTHORIZATION_URL}>
                        Role Descriptions
                      </a>
                    </Form.Label>
                    <Select
                      outerClassName="mx-0 roles-input"
                      field="role"
                      required={true}
                      options={selectRoles}
                      placeholder={initialValues?.roles?.length > 0 ? undefined : 'Select a role'}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Label>Notes</Form.Label>
                    <TextArea
                      field="note"
                      placeholder="Please specify why you need access to PIMS and include your manager's name."
                      required={true}
                      outerClassName="notes-input mx-0"
                    />
                  </Col>
                </Row>
                <Row>
                  <p>
                    By clicking request, you agree to our{' '}
                    <a href={DISCLAIMER_URL}>Terms and Conditions</a> and that you have read our{' '}
                    <a href={PRIVACY_POLICY_URL}>Privacy Policy</a>.
                  </p>
                </Row>

                {alert.show && (
                  <Snackbar
                    show={alert.show}
                    message={alert.message}
                    variant={alert.variant}
                    onClose={() => setAlert({})}
                  />
                )}
                <Row>
                  <Col xs={12}>
                    <ButtonToolbar className="cancelSave pt-0 pb-0">
                      <Button type="submit" className="w-100">
                        {button}
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </Row>
      </Container>
    </div>
  );
};

export default AccessRequestPage;
