/**
 * Claims enum, provides a list of permissions that govern what actions are available to an authenticated user.
 */
export enum Claims {
  PROPERTY_VIEW = 'property-view',
  PROPERTY_EDIT = 'property-edit',
  PROPERTY_ADD = 'property-add',
  PROPERTY_DELETE = 'property-delete',
  DISPOSE_REQUEST = 'dispose-request',
  DISPOSE_APPROVE = 'dispose-approve',
  ADMIN_USERS = 'admin-users',
  ADMIN_ROLES = 'admin-roles',
  ADMIN_PROPERTIES = 'admin-properties',
  ADMIN_PROJECTS = 'admin-projects',
  PROJECT_VIEW = 'project-view',
  PROJECT_EDIT = 'project-edit',
  PROJECT_ADD = 'project-add',
  PROJECT_DELETE = 'project-delete',
  REPORTS_VIEW = 'reports-view',
  REPORTS_SPL = 'reports-spl',
  REPORTS_SPL_ADMIN = 'reports-spl-admin',
}

export default Claims;
