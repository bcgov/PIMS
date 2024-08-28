import 'dotenv/config.js';
import express, { Application, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { sso, protectedRoute } from '@bcgov/citz-imb-sso-express';
import router from '@/routes';
import middleware from '@/middleware';
import constants from '@/constants';
import { SSO_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import errorHandler from '@/middleware/errorHandler';
import { EndpointNotFound404 } from '@/constants/errors';
import nunjucks from 'nunjucks';
import OPENAPI_OPTIONS from '@/swagger/swaggerConfig';

const app: Application = express();

const { TESTING, FRONTEND_URL } = constants;

// Express Rate Limiter Configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Use rate limiter if not testing
if (!TESTING) app.use(limiter);

// CORS Configuration
// TODO: Does localhost need to be specified?
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local frontend testing
    FRONTEND_URL, // Frontend
  ],
  credentials: true,
};

// Incoming CORS Filter
app.use(cors(corsOptions));

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

// Swagger service route
app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(OPENAPI_OPTIONS)));
// Get Custom Middleware
const { headerHandler, morganMiddleware } = middleware;

// Logging Middleware
app.use(morganMiddleware);

// SSO initialization
sso(app, SSO_OPTIONS);

// Nunjucks configuration
const nj = nunjucks.configure('src/notificationTemplates', {
  autoescape: true,
  express: app,
  noCache: true,
});
nj.addFilter(
  'filterByAttr',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (arr: Array<Record<string, any>>, property: string, value: any) {
    return arr.filter((a) => a[property] === value);
  },
);

// Set headers for response
app.use(`/v2`, headerHandler as RequestHandler);

// Unprotected Routes
app.use(`/v2/health`, router.healthRouter);

// Protected Routes
app.use(`/v2/ltsa`, protectedRoute(), router.ltsaRouter);
app.use(`/v2/administrativeAreas`, protectedRoute(), router.administrativeAreasRouter);
app.use(`/v2/agencies`, protectedRoute(), router.agenciesRouter);
app.use('/v2/lookup', protectedRoute(), router.lookupRouter);
app.use(`/v2/users`, protectedRoute(), router.usersRouter);
app.use(`/v2/properties`, protectedRoute(), router.propertiesRouter);
app.use(`/v2/parcels`, protectedRoute(), router.parcelsRouter);
app.use(`/v2/buildings`, protectedRoute(), router.buildingsRouter);
app.use(`/v2/notifications`, protectedRoute(), router.notificationsRouter);
app.use(`/v2/projects`, protectedRoute(), router.projectsRouter);
app.use(`/v2/reports`, protectedRoute(), router.reportsRouter);
app.use(`/v2/tools`, protectedRoute(), router.toolsRouter);

// If a non-existent route is called. Must go after other routes.
app.use('*', (_req, _res, next) => next(EndpointNotFound404));

// Request error handler. Must go last.
app.use(errorHandler);

export default app;
