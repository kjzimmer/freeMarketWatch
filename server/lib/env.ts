import dotenv from 'dotenv';
import path from 'path';

// .env lives in the project root, one level above server/
dotenv.config({ path: path.join(__dirname, '../../.env') });
