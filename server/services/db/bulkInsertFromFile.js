import pkg from 'mssql';
import { uploadCsv } from './uploadCsv.js';

const sql = pkg.default || pkg;

export async function bulkInsertFromFile() {
    let pool = null;

    try {
        pool = await sql.connect(JSON.parse(process.env.DB_CONFIG));
        console.log('SQL connection established');

        // Execute the SQL script
        const resClientsUpload = await uploadCsv('clients');
        const resContactsUpload = await uploadCsv('contacts');

        console.log('CSV files uploaded to database.');
      } catch (err) {
            console.error('Error executing SQL file:', err);
            throw err;
      }
  }