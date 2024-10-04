import controllers from '@/controllers';
import userAuthCheck from '@/middleware/userAuthCheck';
import catchErrors from '@/utilities/controllerErrorWrapper';
import { bulkUploadMimeTypeWhitelist } from '@/utilities/uploadWhitelist';
import express, { NextFunction } from 'express';
import multer from 'multer';
import { Request, Response } from 'express';
import { Roles } from '@/constants/roles';

const router = express.Router();

const {
  getPropertiesForMap,
  importProperties,
  getPropertiesFuzzySearch,
  getPropertyUnion,
  getImportResults,
  getLinkedProjects,
} = controllers;

router.route('/search/fuzzy').get(userAuthCheck(), catchErrors(getPropertiesFuzzySearch));

router.route('/search/geo').get(userAuthCheck(), catchErrors(getPropertiesForMap)); // Formerly wfs route
// router.route('/search/geo/polygon').get(userAuthCheck(), catchErrors()) // TODO: Write Swagger for this route

router.route('/search/linkedProjects').get(userAuthCheck(), catchErrors(getLinkedProjects));

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (!bulkUploadMimeTypeWhitelist.includes(file.mimetype)) {
      return cb(new Error('Unsupported MIME-type.'));
    }
    cb(null, true);
  },
});
const uploadHandler = async (req: Request, res: Response, next: NextFunction) => {
  const mainReqHandler = upload.single('spreadsheet');
  mainReqHandler(req, res, (err) => {
    if (err) {
      return res.status(400).send(err.message ?? 'File upload failed.');
    }
    next();
  });
};
router
  .route('/import')
  .post(
    userAuthCheck({ requiredRoles: [Roles.ADMIN] }),
    uploadHandler,
    catchErrors(importProperties),
  );
router.route('/import/results').get(userAuthCheck(), catchErrors(getImportResults));
router.route('/').get(userAuthCheck(), catchErrors(getPropertyUnion));

export default router;
