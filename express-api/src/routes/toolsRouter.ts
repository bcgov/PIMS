import { Roles } from '@/constants/roles';
import controllers from '@/controllers';
import { getJurisdictionRollNumberByPid } from '@/controllers/tools/toolsController';
import userAuthCheck from '@/middleware/userAuthCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const { searchGeocoderAddresses } = controllers;

router.route(`/geocoder/addresses`).get(userAuthCheck(), catchErrors(searchGeocoderAddresses));
router
  .route(`/jur-roll-xref`)
  .get(
    userAuthCheck({ requiredRoles: [Roles.ADMIN] }),
    catchErrors(getJurisdictionRollNumberByPid),
  );

export default router;
