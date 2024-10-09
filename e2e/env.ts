import dotenv from 'dotenv';

dotenv.config()

export const BASE_URL = process.env.BASE_URL ?? 'localhost:3000';
export const BCSC_USERNAME = process.env.BCSC_USERNAME ?? '';
export const BCSC_PASSWORD = process.env.BCSC_PASSWORD ?? '';
export const BCEID_USERNAME = process.env.BCEID_USERNAME ?? '';
export const BCEID_PASSWORD = process.env.BCEID_PASSWORD ?? '';
