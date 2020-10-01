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
const USER_ERROR = () => toast.dark('Failed to update User', { toastId: USER_ERROR_TOAST_ID });
export const user = {
  USER_UPDATING_TOAST_ID,
  USER_UPDATING,
  USER_UPDATED_TOAST_ID,
  USER_UPDATED,
  USER_ERROR_TOAST_ID,
  USER_ERROR,
};
