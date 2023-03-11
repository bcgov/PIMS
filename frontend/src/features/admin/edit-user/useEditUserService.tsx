import { UPDATE_ROLE } from 'constants/API';
import CustomAxios from 'customAxios';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

/**
 * @description This interface represents the return value of the useEditUserService hook.
 *
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 * @interface
 */
interface IEditUserService {
  addRole: (username: string, roles: string[]) => Promise<void>;
  deleteRole: (username: string, roleName: string[]) => Promise<void>;
}

/**
 * @description This hook returns an object containing functions to add and delete roles to/from a user.
 *
 * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
 * @returns {IEditUserService} Object containing this service's functions
 *
 * @example
 * const { addRole, deleteRole } = useEditUserService();
 */
const useEditUserService = (): IEditUserService => {
  const axios = useMemo(() => CustomAxios(), []);

  /**
   * @description This function adds the given role to the given username.
   *
   * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
   * @returns void
   *
   * @example
   * await addRole("pparker@idir", "Admin")
   */
  const addRole = async (username: string, roles: string[]) => {
    try {
      const requestBody = {
        roles: roles,
      };
      console.log('test: ', requestBody);
      await axios.post('/api' + UPDATE_ROLE(username), requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      toast.error(`Unable to add roles: "${roles.join(', ')}"`);
    }
  };

  /**
   * @description This function removes the given role from the given user.
   *
   * @author Zach Bourque <Zachary.Bourque@gov.bc.ca>
   * @returns void
   *
   * @example
   * await deleteRole("loki@idir", "Admin")
   */
  const deleteRole = async (username: string, roles: string[]) => {
    try {
      const requestBody = {
        roles: roles,
      };
      await axios.delete(`/api${UPDATE_ROLE(username)}`, {
        data: requestBody,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      toast.error(`Unable to remove roles: ${roles.join(', ')}`);
    }
  };

  return { addRole, deleteRole };
};

export default useEditUserService;
