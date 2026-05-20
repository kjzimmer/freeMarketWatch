import dotenv from 'dotenv';
import path from 'path';

// .env lives at the project root (where the server is launched from)
dotenv.config({ path: path.join(process.cwd(), '.env') });
