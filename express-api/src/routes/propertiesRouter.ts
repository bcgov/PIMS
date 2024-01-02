import controllers from '@/controllers';
import express from 'express';

const router = express.Router();

const {
  getProperties,
  getPropertiesFilter,
  getPropertiesForMap,
  getPropertiesForMapFilter,
  getPropertiesPaged,
  getPropertiesPagedFilter,
} = controllers;

// TODO: Could these just be GET requests with query params? Then no need for /filter routes. Would cut controllers in half too.

router.route('/properties/search').get(getProperties);
router.route('/properties/search/filter').post(getPropertiesFilter);

router.route('/properties/search/geo').get(getPropertiesForMap); // Formerly wfs route
router.route('/properties/search/geo/filter').post(getPropertiesForMapFilter);

router.route('/properties/search/page').get(getPropertiesPaged);
router.route('/properties/search/page/filter').post(getPropertiesPagedFilter);

export default router;
