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

router.route('/lookup/agencies').get(lookupAgencies);
router.route('/lookup/roles').get(lookupRoles);
router.route('/lookup/property/classifications').get(lookupPropertyClassifications);
router.route('/lookup/project/tier/levels').get(lookupProjectTierLevels);
router.route('/lookup/project/risks').get(lookupProjectRisks);
router.route('/lookup/all').get(lookupAll);

export default router;
