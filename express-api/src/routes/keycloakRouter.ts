import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

const {
    syncKeycloakGroups,
    getKeycloakRoles,
    getKeycloakRole,
    updateKeycloakRole
} = controllers.keycloak;

const KEYCLOAK_ROUTE = '/keycloak';

// Endpoints for Keycloak Roles
router
  .route('${KEYCLOAK_ROUTE}/role')
  .get(getKeycloakRole)
  .get(getKeycloakRoles)
  .post(syncKeycloakGroups)
  .put(updateKeycloakRole);

export default router;
