import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

const {
  lookupAgencies,
  lookupAll,
  lookupProjectRisks,
  lookupProjectTierLevels,
  lookupPropertyClassifications,
  lookupRoles,
} = controllers;

router.route('/agencies').get(lookupAgencies);
router.route('/roles').get(lookupRoles);
router.route('/property/classifications').get(lookupPropertyClassifications);
router.route('/project/tier/levels').get(lookupProjectTierLevels);
router.route('/project/risks').get(lookupProjectRisks);
router.route('/all').get(lookupAll);

export default router;
