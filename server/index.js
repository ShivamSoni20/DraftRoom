import app from './app.js';
import { createServer } from 'node:http';
createServer(app).listen(process.env.PORT || 3001,()=>console.log('Draftroom API: http://localhost:3001'));
