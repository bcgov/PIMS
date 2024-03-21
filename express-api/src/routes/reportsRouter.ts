import controllers from '@/controllers';
import catchErrors from '@/utilities/controllerErrorWrapper';
import express from 'express';

const router = express.Router();

const {
  getSpreadsheetProjectsReports,
  getSpreadsheetPropertiesReports,
  getSpreadsheetUsersReports,
  submitErrorReport,
} = controllers;

router.route('/projects').get(catchErrors(getSpreadsheetProjectsReports));

/**
 * I'm pretty sure this is not necessary but perhaps someone can weigh in. Why do we need an endpoint specifically for
 * surplus properties reports when surplus is simply a classification of properties? I feel like you should really only
 * need to apply a filter on the general properties endpoint. The endpoints do actually function differently but they appear
 * to produce a similar end result so not sure what the distinction is for.
 */
//router.route('/projects/surplus/properties').get(getSpreadsheetSurplusPropertiesReport);

router.route('/properties').get(catchErrors(getSpreadsheetPropertiesReports));
router.route('/users').get(catchErrors(getSpreadsheetUsersReports));

/**
 * As per other routers, filter is omitted.
 * There is another route I omitted: /reports/properties/all/fields/
 * This is also something that I think should just be rolled into the query string of the properties endpoint.
 * If there are only two export modes (ie default and allFields) then we can just make it a boolean query string.
 * Alternatively, we could add support for enumerating what fields should be excluded/included
 * ie. /reports/properties?include=agency,classification,type
 */

// For errors submitted by the frontend Error Boundary.
router.route('/error').post(catchErrors(submitErrorReport));

export default router;
