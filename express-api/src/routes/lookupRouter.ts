import controllers from '@/controllers';
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
} = controllers;

router.route('/agencies').get(catchErrors(lookupAgencies));
router.route('/roles').get(catchErrors(lookupRoles));
router.route('/property/classifications').get(catchErrors(lookupPropertyClassifications));
router.route('/property/predominateUses').get(catchErrors(lookupBuildingPredominateUse));
router.route('/property/constructionTypes').get(catchErrors(lookupBuildingConstructionType));
router.route('/project/tier/levels').get(catchErrors(lookupProjectTierLevels));
router.route('/project/risks').get(catchErrors(lookupProjectRisks));
router.route('/all').get(catchErrors(lookupAll));

export default router;
