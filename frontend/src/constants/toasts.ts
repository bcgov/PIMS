import { toast } from 'react-toastify';

/**
 * The purpose of this file is to centralize the toasts in use in the application in one location. This should allow us to minimize duplication of toast messages using toastIds. https://fkhadra.github.io/react-toastify/prevent-duplicate
 * In the future we may need to split this file out (at least into /features).
 */

/** These toasts are used by the update user api */
const USER_UPDATING_TOAST_ID = 'UPDATING_USER';
const USER_UPDATING = () => toast.dark('Updating User...', { toastId: USER_UPDATING_TOAST_ID });
const USER_UPDATED_TOAST_ID = 'USER_UPDATED';
const USER_UPDATED = () => toast.dark('User updated', { toastId: USER_UPDATED_TOAST_ID });
const USER_ERROR_TOAST_ID = 'USER_ERROR';
const USER_ERROR = () => toast.error('Failed to update User', { toastId: USER_ERROR_TOAST_ID });
export const user = {
  USER_UPDATING_TOAST_ID,
  USER_UPDATING,
  USER_UPDATED_TOAST_ID,
  USER_UPDATED,
  USER_ERROR_TOAST_ID,
  USER_ERROR,
};

/** These toasts are used by the parcel detail api */
//creating
const PARCEL_CREATING_TOAST_ID = 'CREATING_PARCEL';
const PARCEL_CREATING = () =>
  toast.dark('Creating Parcel...', { toastId: PARCEL_CREATING_TOAST_ID });
const PARCEL_CREATED_TOAST_ID = 'CREATED_PARCEL';
const PARCEL_CREATED = () => toast.dark('Parcel created.', { toastId: PARCEL_CREATED_TOAST_ID });
const PARCEL_CREATING_ERROR_TOAST_ID = 'PARCEL_CREATING_ERROR';
const PARCEL_CREATING_ERROR = () =>
  toast.error('Failed to create Parcel.', { toastId: PARCEL_CREATING_ERROR_TOAST_ID });
//updating
const PARCEL_UPDATING_TOAST_ID = 'UPDATING_PARCEL';
const PARCEL_UPDATING = () =>
  toast.dark('Updating Parcel...', { toastId: PARCEL_UPDATING_TOAST_ID });
const PARCEL_UPDATED_TOAST_ID = 'UPDATED_PARCEL';
const PARCEL_UPDATED = () => toast.dark('Parcel updated.', { toastId: PARCEL_UPDATED_TOAST_ID });
const PARCEL_UPDATING_ERROR_TOAST_ID = 'PARCEL_UPDATING_ERROR';
const PARCEL_UPDATING_ERROR = () =>
  toast.error('Failed to update Parcel.', { toastId: PARCEL_UPDATING_ERROR_TOAST_ID });
//deleting
const PARCEL_DELETING_TOAST_ID = 'DELETING_PARCEL';
const PARCEL_DELETING = () =>
  toast.dark('Deleting Parcel...', { toastId: PARCEL_DELETING_TOAST_ID });
const PARCEL_DELETED_TOAST_ID = 'DELETED_PARCEL';
const PARCEL_DELETED = () => toast.dark('Parcel deleted.', { toastId: PARCEL_DELETED_TOAST_ID });
const PARCEL_DELETING_ERROR_TOAST_ID = 'PARCEL_DELETING_ERROR';
const PARCEL_DELETING_ERROR = () =>
  toast.error('Failed to delete Parcel.', { toastId: PARCEL_DELETING_ERROR_TOAST_ID });
export const parcel = {
  PARCEL_CREATING_TOAST_ID,
  PARCEL_CREATING,
  PARCEL_CREATED_TOAST_ID,
  PARCEL_CREATED,
  PARCEL_CREATING_ERROR_TOAST_ID,
  PARCEL_CREATING_ERROR,
  PARCEL_UPDATING_TOAST_ID,
  PARCEL_UPDATING,
  PARCEL_UPDATED_TOAST_ID,
  PARCEL_UPDATED,
  PARCEL_UPDATING_ERROR_TOAST_ID,
  PARCEL_UPDATING_ERROR,
  PARCEL_DELETING_TOAST_ID,
  PARCEL_DELETING,
  PARCEL_DELETED_TOAST_ID,
  PARCEL_DELETED,
  PARCEL_DELETING_ERROR_TOAST_ID,
  PARCEL_DELETING_ERROR,
};

/** These toasts are used by the building apis */
//creating
const BUILDING_CREATING_TOAST_ID = 'CREATING_BUILDING';
const BUILDING_CREATING = () =>
  toast.dark('Creating Building...', { toastId: BUILDING_CREATING_TOAST_ID });
const BUILDING_CREATED_TOAST_ID = 'CREATED_BUILDING';
const BUILDING_CREATED = () =>
  toast.dark('Building created.', { toastId: BUILDING_CREATED_TOAST_ID });
const BUILDING_CREATING_ERROR_TOAST_ID = 'BUILDING_CREATING_ERROR';
const BUILDING_CREATING_ERROR = () =>
  toast.error('Failed to create Building.', { toastId: BUILDING_CREATING_ERROR_TOAST_ID });
const BUILDING_UPDATING_TOAST_ID = 'UPDATING_BUILDING';
const BUILDING_UPDATING = () =>
  toast.dark('Updating Building...', { toastId: BUILDING_UPDATING_TOAST_ID });
const BUILDING_UPDATED_TOAST_ID = 'UPDATED_BUILDING';
const BUILDING_UPDATED = () =>
  toast.dark('Building updated.', { toastId: BUILDING_UPDATED_TOAST_ID });
const BUILDING_UPDATING_ERROR_TOAST_ID = 'BUILDING_UPDATING_ERROR';
const BUILDING_UPDATING_ERROR = () =>
  toast.error('Failed to update Building.', { toastId: BUILDING_UPDATING_ERROR_TOAST_ID });
//deleting
const BUILDING_DELETING_TOAST_ID = 'DELETING_BUILDING';
const BUILDING_DELETING = () =>
  toast.dark('Deleting Building...', { toastId: BUILDING_DELETING_TOAST_ID });
const BUILDING_DELETED_TOAST_ID = 'DELETED_BUILDING';
const BUILDING_DELETED = () =>
  toast.dark('Building deleted.', { toastId: BUILDING_DELETED_TOAST_ID });
const BUILDING_DELETING_ERROR_TOAST_ID = 'BUILDING_DELETING_ERROR';
const BUILDING_DELETING_ERROR = () =>
  toast.error('Failed to delete Building.', { toastId: BUILDING_DELETING_ERROR_TOAST_ID });
export const building = {
  BUILDING_CREATING_TOAST_ID,
  BUILDING_CREATING,
  BUILDING_CREATED_TOAST_ID,
  BUILDING_CREATED,
  BUILDING_CREATING_ERROR_TOAST_ID,
  BUILDING_CREATING_ERROR,
  BUILDING_UPDATING_TOAST_ID,
  BUILDING_UPDATING,
  BUILDING_UPDATED_TOAST_ID,
  BUILDING_UPDATED,
  BUILDING_UPDATING_ERROR_TOAST_ID,
  BUILDING_UPDATING_ERROR,
  BUILDING_DELETING_TOAST_ID,
  BUILDING_DELETING,
  BUILDING_DELETED_TOAST_ID,
  BUILDING_DELETED,
  BUILDING_DELETING_ERROR_TOAST_ID,
  BUILDING_DELETING_ERROR,
};

/** These toasts are used by the update agency api */
const AGENCY_UPDATING_TOAST_ID = 'UPDATING_AGENCY';
const AGENCY_UPDATING = () =>
  toast.dark('Updating Agency...', { toastId: AGENCY_UPDATING_TOAST_ID });
const AGENCY_UPDATED_TOAST_ID = 'AGENCY_UPDATED';
const AGENCY_UPDATED = () => toast.dark('Agency updated', { toastId: AGENCY_UPDATED_TOAST_ID });
const AGENCY_ERROR_TOAST_ID = 'AGENCY_ERROR';
const AGENCY_ERROR = () => toast.error('Failed to update Agency', { toastId: USER_ERROR_TOAST_ID });
export const agency = {
  AGENCY_UPDATING_TOAST_ID,
  AGENCY_UPDATING,
  AGENCY_UPDATED_TOAST_ID,
  AGENCY_UPDATED,
  AGENCY_ERROR_TOAST_ID,
  AGENCY_ERROR,
};
