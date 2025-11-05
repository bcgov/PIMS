import controllers from '@/controllers';
import {
  lookupMonetaryTypes,
  lookupNoteTypes,
  lookupTasks,
  lookupTimestampTypes,
} from '@/controllers/lookup/lookupController';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  lookupAll,
  lookupProjectTierLevels,
  lookupPropertyClassifications,
  lookupBuildingConstructionType,
  lookupBuildingPredominateUse,
  lookupRegionalDistricts,
  lookupProjectStatuses,
  lookupPropertyTypes,
  lookupBannerMessage,
} = controllers;

router.route('/regionalDistricts').get(catchErrors(lookupRegionalDistricts));
router.route('/property/classifications').get(catchErrors(lookupPropertyClassifications));
router.route('/property/predominateUses').get(catchErrors(lookupBuildingPredominateUse));
router.route('/property/constructionTypes').get(catchErrors(lookupBuildingConstructionType));
router.route('/project/tierLevels').get(catchErrors(lookupProjectTierLevels));
router.route('/project/status').get(catchErrors(lookupProjectStatuses));
router.route('/tasks').get(catchErrors(lookupTasks));
router.route('/propertyTypes').get(catchErrors(lookupPropertyTypes));
router.route('/noteTypes').get(catchErrors(lookupNoteTypes));
router.route('/timestampTypes').get(catchErrors(lookupTimestampTypes));
router.route('/monetaryTypes').get(catchErrors(lookupMonetaryTypes));
router.route('/all').get(catchErrors(lookupAll));

export default router;

/**
 * This is an extra router that needed to be separated so that
 * the banner message was available outside of authorization.
 */
export const bannerRouter = () => {
  const bannerRouter = express.Router();
  bannerRouter.route('/').get(catchErrors(lookupBannerMessage));
  return bannerRouter;
};
