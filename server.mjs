import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current module's file path and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
// Create Express application instance and configure JSON parsing middleware
let app = express();
app.use(express.json());

import morgan from 'morgan';
// Configure HTTP request logging middleware with tiny format
app.use(morgan('tiny'));

import api from './api.mjs';
// Mount API routes under the /api path
app.use('/api', api);

// Configure static file serving, using /dist directory as static resources root
app.use(express.static(__dirname + '/dist'));

// Start server and listen on specified port
const port = 8000;
app.listen(port, () => {
    console.log(`This server presents a Web API at http://localhost:${port}/api`);
    console.log('It also serves static files at ./dist.');
    console.log("Before you run this server, 'npm run build' to build the sample web app.");
    console.log(`Next, point your browser to http://localhost:${port}/`);
});
