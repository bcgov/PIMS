import 'dotenv/config.js';
import express, { Application, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import router from './routes';
import headerHandler from './middleware/headerHandler';
import constants from './constants';

const app: Application = express();

const { TESTING, FRONTEND_URL } = constants;

// Express Rate Limiter Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

// TODO: Add logger here
// TODO: Add Swagger here

// Set headers for response
app.use(`/api/v2`, headerHandler as RequestHandler);

// Use rate limiter if not testing
if (!TESTING) app.use(limiter);

// TODO: Allow versioning by environment variable
app.use(`/api/v2`, router.healthRouter);

export default app;
