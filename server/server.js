// === Load env vars ===
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
console.log('__filename:', __filename);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, './.env') });

// === Load other modules ===
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { getData } from './services/db/contactDataService.js';
import {getDataClient} from './services/db/clientDataService.js';
import { putContactsForClient } from './services/api/putContactsForClient.js';
import zohoAuthRoutes from './auth/zoho.js';  
import { putClient } from './services/api/putClient.js';
import logRequest from './middleware/logRequest.js'; 
import clientDataRoutes from './routes/clientData.js';
import { etlDataService } from './services/db/etlDataService.js';
import { getLogData } from './services/db/logDataService.js';
import { getEndpoints } from './config/EndPoint.js';

const app = express();

let jobStatus = { running: false, startedAt: null, endedAt: null };

// === Use Middleware ===
console.error('NODE_ENV:', process.env.NODE_ENV);
console.error('__dirname:', __dirname);
console.error('__filename:', __filename);
console.error('dotenv:', dotenv.config({ path: path.resolve(__dirname, './.env') }));
console.error('path.resolve(__dirname, ./.env) :', path.resolve(__dirname, './.env'));
const endPoints = getEndpoints(process.env.NODE_ENV);

app.use((req, res, next) => {
  console.log(`🚨 Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || '*'); // Echo back origin
  },
  credentials: false
}));

app.use((req, res, next) => {
  console.log('✅ Final middleware hit:', req.method, req.url);
  next();
});

app.use(express.json());
app.use(clientDataRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth/zoho', zohoAuthRoutes);
app.use(logRequest); // 🔁 Register the logging middleware BEFORE your routes


// === API Route for AG Grid ===

app.post('/getContacts', (req, res) => {
  const { clientId, startRow, endRow, sortModel, filterModel, query } = req.body;
  // Use them to fetch paginated, filtered contact data
});

app.post('/contactDataService', (req, res) => {
    try {
        getData(req.body, (rows, lastRow) => {
          res.json({ rows, lastRow });
        });
      } catch (error) {
        console.error('Error in /contactDataService:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

app.post('/clientDataService', (req, res) => {
  console.log('🔥 /clientDataService hit:', req.body);
  try {
      getDataClient(req.body, (rows, lastRow) => {
        res.json({ rows, lastRow });
      });
    } catch (error) {
      console.error('Error in /clientDataService:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/logDataService', (req, res) => {
  try {
      getLogData(req.body, (rows, lastRow) => {
        res.json({ rows, lastRow });
      });
    } catch (error) {
      console.error('Error in /logDataService:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// === Other Routes ===

app.put('/putContactsForClient', async(req, res) => {
  console.log('PUT /putContactsForClient hit');
  const {id, industry} = req.body;
  try {
    const result = await putContactsForClient(id, industry);
        res.json(result);
    } catch (error) {
      console.error('Error in /putContactsForClient:', error);
      res.status(500).json({ error: `Internal server error: ${error}` });
    }
});

app.put('/putClient', async (req, res) => {
  const {id, industry} = req.body;

  try {
    const result = await putClient(id, industry); //returns true or false
    if(!result) {
      return res.status(500).json({ error: 'Failed to update client and contacts in Zoho Recruit' });
    }
    res.status(200).json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error('Unexpected error in PUT /client/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ETL Sync Job Status

app.get('/etl-job-status', (req, res) => {
  console.error('Received /etl-job-status request');
  console.error('Headers:', req.headers);
  res.json(jobStatus);
});

app.post('/etl-start-job', async(req, res) => {
  jobStatus = { running: true, startedAt: Date.now(), endedAt: null };
  try{
    const result = await etlDataService();

    jobStatus = { ...jobStatus, running: false, endedAt: Date.now() };
    
    res.status(200);
  } catch (error) {
    console.error('Error in /etl-start-job:', error);
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

app.post('/etl-end-job', (req, res) => {
  jobStatus = { ...jobStatus, running: false, endedAt: Date.now() };
  res.sendStatus(200);
});

// if (process.env.NODE_ENV === 'production') {
//   const distPath = path.join(__dirname, '../client/dist');
//   app.use(express.static(distPath));

//   // React Router fallback for SPA
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(distPath, 'index.html'));
//   });
// } else {
//   console.log('🚧 Development mode: Vite dev server should be running on http://localhost:5173');
//   // You can optionally proxy API requests from Vite to this server
// }

// For kicking off the ETL process, server-side
if (process.argv[2] === 'etl') {
  console.log('🔄 ETL mode triggered.');
  await etlDataService();
  process.exit(0);
}

const PORT = process.env.PORT || 5000;
console.error('process.env.port:', process.env.PORT);
console.error('PORT:', PORT);
app.listen(PORT, '0.0.0.0', () => {
  console.error(`🕒 App started at: ${new Date().toISOString()}`);
});

