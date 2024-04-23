import { Roles } from "@/constants/roles";
import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export const insufficientRoleRedirect = (permittedRoles: Roles[], redirectRoute?: string) => {
  const userContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (!userContext.keycloak.hasRole(permittedRoles, { requireAllRoles: false })) {
    navigate(redirectRoute ?? '/');
  }
};

export const inactiveStatusRedirect = (redirectRoute?: string) => {
  const userContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (userContext.pimsUser?.data?.Status !== 'Active') {
    navigate(redirectRoute ?? '/');
  }
};
