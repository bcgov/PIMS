import 'dotenv/config.js';
import express, { Application, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { keycloak, protectedRoute } from '@bcgov/citz-imb-kc-express';
import router from '@/routes';
import middleware from '@/middleware';
import constants from '@/constants';
import { KEYCLOAK_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import swaggerUi from 'swagger-ui-express';
import { Roles } from '@/constants/roles';
import swaggerJSON from '@/swagger/swagger-output.json';

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
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON));
// Get Custom Middleware
const { headerHandler, morganMiddleware } = middleware;

// Logging Middleware
app.use(morganMiddleware);

// Keycloak initialization
keycloak(app, KEYCLOAK_OPTIONS);

// Set headers for response
app.use(`/api/v2`, headerHandler as RequestHandler);

// Unprotected Routes
app.use(`/api/v2`, router.healthRouter);

// Protected Routes
app.use(`/api/v2`, protectedRoute(), router.ltsaRouter);
app.use(`/api/v2`, protectedRoute([Roles.ADMIN]), router.adminRouter);
app.use(`/api/v2`, protectedRoute(), router.parcelsRouter);
app.use('/api/v2', protectedRoute(), router.lookupRouter);
app.use(`/api/v2`, protectedRoute(), router.usersRouter);
app.use(`/api/v2`, protectedRoute(), router.notificationsRouter);

export default app;
