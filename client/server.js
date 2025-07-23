// server.js (ES module version)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import { getEndpoints } from './src/config/EndPoint';

//const endPoints = getEndpoints(process.env.NODE_ENV);
const app = express();
const PORT = process.env.PORT || 5000;//endPoints.VITE_APP_SERVER_PORT;

// Required to mimic __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optional: redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend Node.js server listening on port ${PORT}`);
});
