import * as dotenv from 'dotenv';
dotenv.config();

export const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY;
export const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
