import FilterBackdrop from 'components/maps/leaflet/FilterBackdrop';
import { Claims } from 'constants/claims';
import { IENotSupportedPage } from 'features/account/IENotSupportedPage';
import Login from 'features/account/Login';
import { LogoutPage } from 'features/account/Logout';
import { LayoutWrapper } from 'features/projects/common/LayoutWrapper';
import { ProjectLayout } from 'features/projects/disposals';
import {
  ProjectCloseOut,
  ProjectDocumentation,
  ProjectERPTabs,
  ProjectInformationTabs,
  ProjectNotifications,
  ProjectNotSPL,
  ProjectSPLTabs,
} from 'features/projects/disposals';
import {
  ProjectERPApproval,
  ProjectERPComplete,
  ProjectERPDisposed,
  ProjectERPExemption,
} from 'features/projects/disposals/erp';
import { ProjectInformation, ProjectProperties } from 'features/projects/disposals/information';
import {
  ProjectSPLApproval,
  ProjectSPLContractInPlace,
  ProjectSPLMarketing,
  ProjectSPLTransferWithinGRE,
} from 'features/projects/disposals/spl';
import MapView from 'features/properties/map/MapView';
import { FormikValues } from 'formik';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import AccessDenied from 'pages/401/AccessDenied';
import { NotFoundPage } from 'pages/404/NotFoundPage';
import Test from 'pages/Test.ignore';
import React, { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { Col } from 'react-bootstrap';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ReviewApproveStep } from '../projects/assess';
import { IsAuthenticatedRoute } from './IsAuthenticatedRoute';
import PrivateRoute from './PrivateRoute';

const AccessRequestPage = lazy(() => import('features/admin/access-request/AccessRequestPage'));
const EditUserPage = lazy(() => import('features/admin/edit-user/EditUserPage'));
const ManageAccessRequests = lazy(() => import('features/admin/access/ManageAccessRequests'));
const ProjectListView = lazy(() => import('features/projects/list/ProjectListView'));
const ProjectApprovalRequestListView = lazy(() =>
  import('features/projects/list/ProjectApprovalRequestListView'),
);
const ProjectRouter = lazy(() => import('features/projects/common/ProjectRouter'));
const SPLProjectListView = lazy(() => import('features/projects/list/SPLProjectListView'));
const ProjectDisposeView = lazy(() => import('features/projects/dispose/ProjectDisposeView'));
const SplReportContainer = lazy(() => import('features/splReports/containers/SplReportContainer'));
const ManageAgencies = lazy(() => import('features/admin/agencies/ManageAgencies'));
const EditAgencyPage = lazy(() => import('features/admin/agencies/EditAgencyPage'));
const ManageAdminAreas = lazy(() => import('features/admin/admin-areas/ManageAdminAreas'));
const ManageUsers = lazy(() => import('features/admin/users/ManageUsers'));
const EditAdminArea = lazy(() => import('features/admin/admin-areas/EditAdminArea'));
const PropertyListView = lazy(() => import('features/properties/list/PropertyListView'));

export const AppRouter: React.FC = () => {
  const formikRef = useRef<FormikValues>();
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
                  component={MapView}
                  layout={AuthLayout}
                  title={getTitle('Map View')}
                />
              }
            />
            <Route
              path=":id"
              element={
                <LayoutWrapper
                  component={MapView}
                  layout={AuthLayout}
                  title={getTitle('Map View')}
                />
              }
            />
          </Route>
          <Route path="/properties/list" element={<PrivateRoute claim={Claims.PROPERTY_VIEW} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={PropertyListView}
                  layout={AuthLayout}
                  title={getTitle('View Inventory')}
                />
              }
            />
          </Route>
          <Route path="/admin/users" element={<PrivateRoute claim={Claims.ADMIN_USERS} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={ManageUsers}
                  layout={AuthLayout}
                  title={getTitle('Users Management')}
                />
              }
            />
          </Route>
          <Route path="/admin/user:id?" element={<PrivateRoute claim={Claims.ADMIN_USERS} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={ManageUsers}
                  layout={AuthLayout}
                  title={getTitle('Users Management')}
                />
              }
            />
          </Route>
          <Route
            path="/admin/access/requests"
            element={<PrivateRoute claim={Claims.ADMIN_USERS} />}
          >
            <Route
              index
              element={
                <LayoutWrapper
                  component={ManageAccessRequests}
                  layout={AuthLayout}
                  title={getTitle('Access Requests')}
                />
              }
            />
          </Route>
          <Route path="/admin/agencies" element={<PrivateRoute claim={Claims.ADMIN_USERS} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={ManageAgencies}
                  layout={AuthLayout}
                  title={getTitle('Agency Management')}
                />
              }
            />
          </Route>
          <Route
            path="/admin/administrativeAreas"
            element={<PrivateRoute claim={Claims.ADMIN_USERS} />}
          >
            <Route
              index
              element={
                <LayoutWrapper
                  component={ManageAdminAreas}
                  layout={AuthLayout}
                  title={getTitle('Users Management')}
                />
              }
            />
          </Route>
          <Route
            path="/admin/administrativeArea/:id"
            element={<PrivateRoute claim={Claims.ADMIN_USERS} />}
          >
            <Route
              index
              element={
                <LayoutWrapper
                  component={EditAdminArea}
                  layout={AuthLayout}
                  title={getTitle('Edit Adminstrative Area')}
                />
              }
            />
          </Route>
          <Route
            path="/admin/administrativeArea/new"
            element={<PrivateRoute claim={Claims.ADMIN_USERS} />}
          >
            <Route
              index
              element={
                <LayoutWrapper
                  component={EditAdminArea}
                  layout={AuthLayout}
                  title={getTitle('Create Adminstrative Area')}
                />
              }
            />
          </Route>
          <Route path="/admin/user/:id" element={<PrivateRoute claim={Claims.ADMIN_USERS} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={EditUserPage}
                  layout={AuthLayout}
                  title={getTitle('Edit User')}
                />
              }
            />
          </Route>
          <Route path="/admin/agency/:id" element={<PrivateRoute claim={Claims.ADMIN_USERS} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={EditAgencyPage}
                  layout={AuthLayout}
                  title={getTitle('Edit Agency')}
                />
              }
            />
          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute claim={Claims.ADMIN_USERS}>
                <Route path="/admin/users" element={<Navigate to="admin/users" />}>
                  <LayoutWrapper
                    component={ManageUsers}
                    layout={AuthLayout}
                    title={getTitle('Users Management')}
                  />
                </Route>
                <Route
                  path="admin/access/requests"
                  element={<Navigate to="/admin/access/requests" />}
                >
                  <LayoutWrapper
                    component={ManageAccessRequests}
                    layout={AuthLayout}
                    title={getTitle('Access Requests')}
                  />
                </Route>
                <Route path="user/:id?">
                  <LayoutWrapper
                    component={EditUserPage}
                    layout={AuthLayout}
                    title={getTitle('Edit User')}
                  />
                </Route>
                <Route path="admin/agencies">
                  <LayoutWrapper
                    component={ManageAgencies}
                    layout={AuthLayout}
                    title={getTitle('Agency Management')}
                  />
                </Route>
                <Route path="admin/agency/:id">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route path="admin/agency/new">
                  <LayoutWrapper
                    component={EditAgencyPage}
                    layout={AuthLayout}
                    title={getTitle('Edit Agency')}
                  />
                </Route>
                <Route
                  path="admin/administrativeAreas"
                  element={<Navigate to="admin/administrativeAreas" />}
                >
                  <LayoutWrapper
                    component={ManageAdminAreas}
                    layout={AuthLayout}
                    title={getTitle('Adminstrative Areas')}
                  />
                </Route>
                <Route path="admin/administrativeArea/:id">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Edit Adminstrative Area')}
                  />
                </Route>
                <Route path="admin/administrativeArea/new">
                  <LayoutWrapper
                    component={EditAdminArea}
                    layout={AuthLayout}
                    title={getTitle('Create Administrative Area')}
                  />
                </Route>
              </PrivateRoute>
            }
          ></Route>
          <Route path="/dispose" element={<PrivateRoute claim={Claims.PROJECT_ADD} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={ProjectDisposeView}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              }
            />
            <Route
              path="/dispose/projects/draft"
              element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
            >
              <Route
                index
                element={
                  <LayoutWrapper
                    component={ProjectDisposeView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                }
              />
            </Route>
            <Route
              path="/dispose/projects/properties"
              element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
            >
              <Route
                index
                element={
                  <LayoutWrapper
                    component={ProjectDisposeView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                }
              />
            </Route>
            <Route
              path="/dispose/projects/information"
              element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
            >
              <Route
                index
                element={
                  <LayoutWrapper
                    component={ProjectDisposeView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                }
              />
            </Route>
            <Route
              path="/dispose/projects/documentation"
              element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
            >
              <Route
                index
                element={
                  <LayoutWrapper
                    component={ProjectDisposeView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                }
              />
            </Route>
            <Route
              path="/dispose/projects/approval"
              element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
            >
              <Route
                index
                element={
                  <LayoutWrapper
                    component={ProjectDisposeView}
                    layout={AuthLayout}
                    title={getTitle('View SPL Projects')}
                  />
                }
              />
            </Route>
          </Route>
          <Route
            path="/dispose/projects/review"
            element={<PrivateRoute claim={Claims.PROJECT_ADD} />}
          >
            <Route
              index
              element={
                <LayoutWrapper
                  component={ProjectDisposeView}
                  layout={AuthLayout}
                  title={getTitle('View SPL Projects')}
                />
              }
            />
          </Route>
          <Route
            path="/projects/assess/properties"
            element={
              <PrivateRoute claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}></PrivateRoute>
            }
          >
            <Route
              index
              element={
                <LayoutWrapper
                  layout={AuthLayout}
                  component={ReviewApproveStep}
                  componentProps={{ formikRef }}
                ></LayoutWrapper>
              }
            />
          </Route>
          <Route path="/projects/spl" element={<PrivateRoute claim={Claims.PROJECT_VIEW} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={SPLProjectListView}
                  layout={AuthLayout}
                  title={getTitle('View SPL Projects')}
                />
              }
            />
          </Route>
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
          <Route path="/projects" element={<PrivateRoute claim={Claims.PROJECT_ADD} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={ProjectRouter}
                  layout={AuthLayout}
                  title={getTitle('Dispose Property')}
                />
              }
            />
          </Route>
          <Route path="/reports/spl" element={<PrivateRoute claim={Claims.REPORTS_SPL} />}>
            <Route
              index
              element={
                <LayoutWrapper
                  component={SplReportContainer}
                  layout={AuthLayout}
                  title={getTitle('SPL Reports')}
                />
              }
            />
          </Route>
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
        <Route path="/projects/list" element={<PrivateRoute claim={Claims.PROJECT_VIEW} />}>
          <Route
            index
            element={
              <LayoutWrapper
                component={ProjectListView}
                layout={AuthLayout}
                title={getTitle('View Projects')}
              />
            }
          />
        </Route>
        <Route path="/projects/disposal" element={<PrivateRoute claim={Claims.PROJECT_ADD} />}>
          <Route
            path=":id"
            element={
              <LayoutWrapper
                component={ProjectLayout}
                layout={AuthLayout}
                title={getTitle('Disposal Project')}
              />
            }
          >
            <Route index element={<Navigate to={`${location.pathname}/information`} />} />
            <Route
              path="information"
              element={<LayoutWrapper component={ProjectInformationTabs} />}
            >
              <Route index element={<ProjectInformation />} />
              <Route path="properties" element={<ProjectProperties />} />
            </Route>
            <Route
              path="documentation"
              element={<LayoutWrapper component={ProjectDocumentation} />}
            />
            <Route path="erp" element={<LayoutWrapper component={ProjectERPTabs} />}>
              <Route index element={<ProjectERPApproval />} />
              <Route path="exemption" element={<ProjectERPExemption />} />
              <Route path="complete" element={<ProjectERPComplete />} />
              <Route path="disposed" element={<ProjectERPDisposed />} />
            </Route>
            <Route path="not/spl" element={<LayoutWrapper component={ProjectNotSPL} />} />
            <Route path="spl" element={<LayoutWrapper component={ProjectSPLTabs} />}>
              <Route index element={<ProjectSPLApproval />} />
              <Route path="marketing" element={<ProjectSPLMarketing />} />
              <Route path="contract/in/place" element={<ProjectSPLContractInPlace />} />
              <Route path="transfer/within/gre" element={<ProjectSPLTransferWithinGRE />} />
            </Route>
            <Route path="close/out" element={<LayoutWrapper component={ProjectCloseOut} />} />
            <Route
              path="notifications"
              element={<LayoutWrapper component={ProjectNotifications} />}
            />
          </Route>
        </Route>
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
          path="*"
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
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
