import controllers from '@/controllers';
import { lookupTasks } from '@/controllers/lookup/lookupController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  lookupAgencies,
  lookupAll,
  lookupProjectRisks,
  lookupProjectTierLevels,
  lookupPropertyClassifications,
  lookupRoles,
  lookupBuildingConstructionType,
  lookupBuildingPredominateUse,
  lookupRegionalDistricts,
  lookupProjectStatuses,
  lookupPropertyTypes,
} = controllers;

router.route('/agencies').get(catchErrors(lookupAgencies));
router.route('/roles').get(catchErrors(lookupRoles));
router.route('/regionalDistricts').get(catchErrors(lookupRegionalDistricts));
router.route('/property/classifications').get(catchErrors(lookupPropertyClassifications));
router.route('/property/predominateUses').get(catchErrors(lookupBuildingPredominateUse));
router.route('/property/constructionTypes').get(catchErrors(lookupBuildingConstructionType));
router.route('/project/tierLevels').get(catchErrors(lookupProjectTierLevels));
router.route('/project/risks').get(catchErrors(lookupProjectRisks));
router.route('/project/status').get(catchErrors(lookupProjectStatuses));
router.route('/tasks').get(catchErrors(lookupTasks));
router.route('/propertyTypes').get(catchErrors(lookupPropertyTypes));
router.route('/all').get(catchErrors(lookupAll));

export default router;
