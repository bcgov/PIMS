/**
 * Claims enum, provides a list of permissions that govern what actions are available to an authenticated user.
 */
export enum Claim {
  PropertyView = 'property-view',
  PropertyEdit = 'property-edit',
  PropertyAdd = 'property-add',
  PropertyDelete = 'property-delete',
  DisposeRequest = 'dispose-request',
  DisposeApprove = 'dispose-approve',
  AdminUsers = 'admin-users',
  AdminRoles = 'admin-roles',
  AdminProperties = 'admin-properties',
  AdminProjects = 'admin-projects',
  ProjectView = 'project-view',
  ProjectEdit = 'project-edit',
  ProjectAdd = 'project-add',
  ProjectDelete = 'project-delete',
  ReportsView = 'reports-view',
  ReportsSpl = 'reports-spl',
  ReportsSplAdmin = 'reports-spl-admin',
}

export default Claim;
