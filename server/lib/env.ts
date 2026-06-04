import dotenv from 'dotenv';
import path from 'path';

// .env lives at the project root — resolve relative to this file, not cwd
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
