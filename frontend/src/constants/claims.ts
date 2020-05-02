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
}

export default Claims;
