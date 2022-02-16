import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import { LayoutWrapper } from 'components/router/LayoutWrapper';
import { Claims } from 'constants/claims';
import { IENotSupportedPage } from 'features/account/IENotSupportedPage';
import Login from 'features/account/Login';
import { LogoutPage } from 'features/account/Logout';
import MapView from 'features/properties/map/MapView';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import AccessDenied from 'pages/401/AccessDenied';
import { NotFoundPage } from 'pages/404/NotFoundPage';
import Test from 'pages/Test.ignore';
import React, { lazy, Suspense, useLayoutEffect } from 'react';
import { Col } from 'react-bootstrap';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { IsAuthenticatedRoute } from './IsAuthenticatedRoute';
import PrivateRoute from './PrivateRoute';

const AccessRequestPage = lazy(() => import('features/admin/access-request/AccessRequestPage'));
const EditUserPage = lazy(() => import('features/admin/edit-user/EditUserPage'));
const ManageAccessRequests = lazy(() => import('features/admin/access/ManageAccessRequests'));
const ProjectDisposalSubmitted = lazy(
  () => import('features/projects/dispose/ProjectDisposalSubmitted'),
);
const ProjectDisposalExemptionSubmitted = lazy(
  () => import('features/projects/dispose/ProjectDisposalExemptionSubmitted'),
);
const ProjectListView = lazy(() => import('features/projects/list/ProjectListView'));
const ProjectApprovalRequestListView = lazy(
  () => import('features/projects/list/ProjectApprovalRequestListView'),
);
const SPLProjectListView = lazy(() => import('features/projects/list/SPLProjectListView'));
const ProjectRouter = lazy(() => import('features/projects/common/ProjectRouter'));
const ProjectDisposeView = lazy(() => import('features/projects/dispose/ProjectDisposeView'));
const SplReportContainer = lazy(() => import('features/splReports/containers/SplReportContainer'));
const ManageAgencies = lazy(() => import('features/admin/agencies/ManageAgencies'));
const EditAgencyPage = lazy(() => import('features/admin/agencies/EditAgencyPage'));
const ManageAdminAreas = lazy(() => import('features/admin/admin-areas/ManageAdminAreas'));
const ManageUsers = lazy(() => import('features/admin/users/ManageUsers'));
const EditAdminArea = lazy(() => import('features/admin/admin-areas/EditAdminArea'));
const PropertyListView = lazy(() => import('features/properties/list/PropertyListView'));

export const AppRouter: React.FC = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const getTitle = (page: string) => {
    return `PIMS${' - ' + page}`;
  };
  const keycloak = useKeycloakWrapper();
  return (
    <Suspense
      fallback={
        keycloak.obj.authenticated ? (
          <AuthLayout>
            <FilterBackdrop show={true}></FilterBackdrop>
          </AuthLayout>
        ) : (
          <PublicLayout>
            <Col>
              <FilterBackdrop show={true}></FilterBackdrop>
            </Col>
          </PublicLayout>
        )
      }
    >
      <Routes>
        <Route path="/" element={<IsAuthenticatedRoute />}>
          <Route index element={<Navigate to="/mapview" />} />
          <Route path="mapview" element={<PrivateRoute claim={Claims.PROPERTY_VIEW} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={() => <MapView />}
                  layout={AuthLayout}
                  title={getTitle('Map View')}
                />
              }
            />
            <Route
              path=":id"
              element={
                <LayoutWrapper
                  component={() => <MapView />}
                  layout={AuthLayout}
                  title={getTitle('Map View')}
                />
              }
            />
          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute claim={Claims.ADMIN_USERS}>
                <Route path="/admin/users">
                  <LayoutWrapper
                    component={ManageUsers}
                    layout={AuthLayout}
                    title={getTitle('Users Management')}
                  />
                </Route>
                <Route path="/admin/access/requests">
                  <LayoutWrapper
                    component={ManageAccessRequests}
                    layout={AuthLayout}
                    title={getTitle('Access Requests')}
                  />
                </Route>
                <Route path="/admin/user/:id?">
                  <LayoutWrapper
                    component={EditUserPage}
                    layout={AuthLayout}
                    title={getTitle('Edit User')}
                  />
                </Route>
                <Route path="/admin/agencies">
                  <LayoutWrapper
                    component={ManageAgencies}
                    layout={AuthLayout}
                    title={getTitle('Agency Management')}
                  />
                </Route>
                <Route path="/admin/agency/:id">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route path="/admin/agency/new">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route path="/admin/administrativeAreas">
                  <LayoutWrapper
                    component={ManageAdminAreas}
                    layout={AuthLayout}
                    title={getTitle('Adminstrative Areas')}
                  />
                </Route>
                <Route path="/admin/administrativeArea/:id">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Edit Adminstrative Area')}
                  />
                </Route>
                <Route path="/admin/administrativeArea/new">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Create Administrative Area')}
                  />
                </Route>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/properties/list"
            element={
              <LayoutWrapper
                component={PropertyListView}
                layout={AuthLayout}
                title={getTitle('View Inventory')}
              />
            }
          />
          <Route
            path="/dispose"
            element={
              <PrivateRoute claim={Claims.PROJECT_ADD}>
                <LayoutWrapper
                  component={ProjectDisposeView}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute claim={Claims.PROJECT_ADD}>
                <LayoutWrapper
                  component={ProjectRouter}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              </PrivateRoute>
            }
          />
          <Route
            element={
              <PrivateRoute claim={Claims.PROJECT_VIEW}>
                <Route path="/projects/list">
                  <LayoutWrapper
                    component={ProjectListView}
                    layout={AuthLayout}
                    title={getTitle('View Projects')}
                  />
                </Route>
                <Route path="/projects/spl">
                  <LayoutWrapper
                    component={SPLProjectListView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                </Route>
                <Route path="/project/submitted">
                  <LayoutWrapper
                    component={ProjectDisposalSubmitted}
                    layout={AuthLayout}
                    title={getTitle('Dispose Property Submitted')}
                  />
                </Route>
                <Route path="/project/exemption/submitted">
                  <LayoutWrapper
                    component={ProjectDisposalExemptionSubmitted}
                    layout={AuthLayout}
                    title={getTitle('Dispose Property Submitted')}
                  />
                </Route>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/approval/requests"
            element={
              <PrivateRoute claim={Claims.DISPOSE_APPROVE}>
                <LayoutWrapper
                  component={ProjectApprovalRequestListView}
                  layout={AuthLayout}
                  title={getTitle('Surplus Property Program Projects - Approval Requests')}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports/spl"
            element={
              <PrivateRoute claim={Claims.REPORTS_SPL}>
                <LayoutWrapper
                  component={SplReportContainer}
                  layout={AuthLayout}
                  title={getTitle('SPL Reports')}
                />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <LayoutWrapper title={getTitle('Login')} component={Login} layout={PublicLayout} />
          }
        />
        <Route
          path="/logout"
          element={<LayoutWrapper title={getTitle('Logout')} component={LogoutPage} />}
        />
        <Route
          path="/access/request"
          element={
            <LayoutWrapper
              component={AccessRequestPage}
              layout={AuthLayout}
              title={getTitle('Request Access')}
            />
          }
        />
        <Route
          path="/ienotsupported"
          element={
            <LayoutWrapper
              title={getTitle('IE Not Supported')}
              component={IENotSupportedPage}
              layout={PublicLayout}
            />
          }
        />
        <Route
          path="/forbidden"
          element={
            <LayoutWrapper
              title={getTitle('Forbidden')}
              component={AccessDenied}
              layout={PublicLayout}
            />
          }
        />
        <Route
          path="/page-not-found"
          element={
            <LayoutWrapper
              title={getTitle('Page Not Found')}
              component={NotFoundPage}
              layout={PublicLayout}
            />
          }
        />
        <Route
          path="/test"
          element={
            <LayoutWrapper title={getTitle('Test')} component={Test} layout={PublicLayout} />
          }
        />
        {/* <Route path="/" element={<IsAuthenticatedRoute />}>
          <Route
            path="/admin"
            element={
              <PrivateRoute claim={Claims.ADMIN_USERS}>
                <Route path="/admin/users">
                  <LayoutWrapper
                    component={ManageUsers}
                    layout={AuthLayout}
                    title={getTitle('Users Management')}
                  />
                </Route>
                <Route path="/admin/access/requests">
                  <LayoutWrapper
                    component={ManageAccessRequests}
                    layout={AuthLayout}
                    title={getTitle('Access Requests')}
                  />
                </Route>
                <Route path="/admin/user/:id?">
                  <LayoutWrapper
                    component={EditUserPage}
                    layout={AuthLayout}
                    title={getTitle('Edit User')}
                  />
                </Route>
                <Route path="/admin/agencies">
                  <LayoutWrapper
                    component={ManageAgencies}
                    layout={AuthLayout}
                    title={getTitle('Agency Management')}
                  />
                </Route>
                <Route path="/admin/agency/:id">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route path="/admin/agency/new">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route path="/admin/administrativeAreas">
                  <LayoutWrapper
                    component={ManageAdminAreas}
                    layout={AuthLayout}
                    title={getTitle('Adminstrative Areas')}
                  />
                </Route>
                <Route path="/admin/administrativeArea/:id">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Edit Adminstrative Area')}
                  />
                </Route>
                <Route path="/admin/administrativeArea/new">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Create Administrative Area')}
                  />
                </Route>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/mapView"
            element={
              <PrivateRoute claim={Claims.PROPERTY_VIEW}>
                <Route path="/mapView/:id?">
                  <LayoutWrapper
                    component={MapView}
                    layout={AuthLayout}
                    title={getTitle('Map View')}
                  />
                </Route>
                <Route path="/properties/list">
                  <LayoutWrapper
                    component={PropertyListView}
                    layout={AuthLayout}
                    title={getTitle('View Inventory')}
                  />
                </Route>
              </PrivateRoute>
            }
          />
          <Route
            path="/dispose"
            element={
              <PrivateRoute claim={Claims.PROJECT_ADD}>
                <LayoutWrapper
                  component={ProjectDisposeView}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute claim={Claims.PROJECT_ADD}>
                <LayoutWrapper
                  component={ProjectRouter}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              </PrivateRoute>
            }
          />
          <Route
            element={
              <PrivateRoute claim={Claims.PROJECT_VIEW}>
                <Route path="/projects/list">
                  <LayoutWrapper
                    component={ProjectListView}
                    layout={AuthLayout}
                    title={getTitle('View Projects')}
                  />
                </Route>
                <Route path="/projects/spl">
                  <LayoutWrapper
                    component={SPLProjectListView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                </Route>
                <Route path="/project/submitted">
                  <LayoutWrapper
                    component={ProjectDisposalSubmitted}
                    layout={AuthLayout}
                    title={getTitle('Dispose Property Submitted')}
                  />
                </Route>
                <Route path="/project/exemption/submitted">
                  <LayoutWrapper
                    component={ProjectDisposalExemptionSubmitted}
                    layout={AuthLayout}
                    title={getTitle('Dispose Property Submitted')}
                  />
                </Route>
              </PrivateRoute>
            }
          />
          <Route
            element={
              <PrivateRoute claim={Claims.DISPOSE_APPROVE}>
                <Route path="/projects/approval/requests">
                  <LayoutWrapper
                    component={ProjectApprovalRequestListView}
                    layout={AuthLayout}
                    title={getTitle('Surplus Property Program Projects - Approval Requests')}
                  />
                </Route>
              </PrivateRoute>
            }
          />
          <Route
            element={
              <PrivateRoute claim={Claims.REPORTS_SPL}>
                <Route path="/reports/spl">
                  <LayoutWrapper
                    component={SplReportContainer}
                    layout={AuthLayout}
                    title={getTitle('SPL Reports')}
                  />
                </Route>
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*">
          <LayoutWrapper title="*" component={() => <Navigate to="/page-not-found" />} />
        </Route> */}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
