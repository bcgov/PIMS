import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
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

router.route('/search').get(catchErrors(getProperties));
router.route('/search/filter').post(catchErrors(getPropertiesFilter));

router.route('/search/geo').get(catchErrors(getPropertiesForMap)); // Formerly wfs route
router.route('/search/geo/filter').post(catchErrors(getPropertiesForMapFilter));

router.route('/search/page').get(catchErrors(getPropertiesPaged));
router.route('/search/page/filter').post(catchErrors(getPropertiesPagedFilter));

export default router;
