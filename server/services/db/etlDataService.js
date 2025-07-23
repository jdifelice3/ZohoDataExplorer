import { getAccessToken } from '../auth/authService.js';
import {parse} from 'json2csv';
import fs from 'fs';
import axios from 'axios';
import {Contact, Client} from '../../models/ZohoFactory.js';
import { bulkInsertFromFile } from './bulkInsertFromFile.js';
import { logToDB } from '../db/logToDB.js';
import { join } from 'path';

export const etlDataService = async() => {
  const startTime = Date.now();
  let oContact = new Contact();
  let oClient = new Client(); 

  console.log('getAccessToken URL:',process.env.ZOHO_RECRUIT_CLIENT_ALL_REFRESH_TOKEN)
  const accessToken = await getAccessToken(process.env.ZOHO_RECRUIT_CLIENT_ALL_REFRESH_TOKEN);

  let clients = null;
  let contacts = null;
  let mappedClients = [];
  let mappedContacts = [];

  try {
  
    clients = await getAllZohoRecords(accessToken, process.env.ZOHO_API_GET_CLIENTS_URL);
    if (!clients.length) {
      console.log('No clients found.');
    }
  } catch (error){
    console.error('❌ Error fetching clients:', error.response?.data || error.message);
  }

  mappedClients = oClient.getMappedRecords(clients);

  try {
    contacts = await getAllZohoRecords(accessToken, process.env.ZOHO_API_GET_CONTACTS);
    if (!contacts.length) {
      console.log('No contacts found.');
    }
  } catch (error){
    console.error('❌ Error fetching contacts:', error.response?.data || error.message);
  }

  mappedContacts = oContact.getMappedRecords(contacts);

  // Step 1: Build a lookup map from clients
  const clientMap = [];
  for (const client of mappedClients) {
    clientMap[client.client_name] = client.industry;
  }

  // Step 2: Assign Tag for each contact based on client Industry
  for (const contact of mappedContacts) {
    const industry = clientMap[contact.client_name];
    if (industry) {
      contact.associated_tags = industry;
    }
  }

  // Step 3: Write the files to the specified folder
  const clientCsvFilePath = join('./', process.env.DB_CLIENT_CSV_FILENAME);
  
  exportClientsToCSV(mappedClients, clientCsvFilePath);
  const contactCsvFilePath = join('./', process.env.DB_CONTACT_CSV_FILENAME);
  exportClientsToCSV(mappedContacts, contactCsvFilePath);

  // Step 4: call BULK INSERT in SQL Server
  try{
    const reults = await bulkInsertFromFile();
    
    console.log('Done');
    const endTime = Date.now();
    const logData = {
      timestamp: new Date().toISOString(),
      userId: 'ZohoSync',
      source: 'SYNC',
      action: ``,
      method: '',
      endpoint: '/etl-start-job',
      statusCode: 200,
      durationMs:endTime - startTime,
      errorText: '',
      meta: {}
    };
    await logToDB(logData);
    console.log('Log saved');
  } catch (error){
    console.error('Logging failed', error);
  }

  //=== FUNCTIONS ===

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getAllZohoRecords(accessToken, endpoint) {
    let allRecords = [];
    let page = 1;
    const perPage = 200;

    let moreRecords = true;
    
    while (moreRecords) {
      try {
        const response = await axios.get(
          `${endpoint}?page=${page}&per_page=${perPage}`,
          {
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`
            }
          }
        );

        const records = response.data.data;
        allRecords.push(...records);
        moreRecords = response.data.info && response.data.info.more_records === true;
        page++;

        await sleep(1000); // Throttle: wait 1 second between requests

      } catch (error) {
          if (error.response && error.response.status === 429) {
            const resetSeconds = parseInt(error.response.headers['x-ratelimit-reset']) || 60;
            console.warn(`Rate limit hit. Sleeping for ${resetSeconds} seconds...`);
            await sleep(resetSeconds * 1000);
            // retry same page
          } else {
            console.error(`Error on page ${page}:`, error.message);
            break;
          }
      }
    }
    
    return allRecords;
  }

  async function exportClientsToCSV(records, outputFilePath) {
    try {
      if (!records.length) {
        console.log('No records found.');
        return;
      }
  
      const options = {
        delimiter: '\t',
        quote: '',               // no wrapping quotes
        escapedQuote: '',        // don't escape quotes
        quoteColumns: false,     // don't quote every column
        quoteEmpty: false        // don't quote empty values either
      };

      const csv = parse(records, options); // ← no constructor, just call the parse function
  
      fs.writeFileSync(outputFilePath, csv);
      console.log(`✅ Successfully saved ${records.length} clients to ${outputFilePath}`);
    } catch (error) {
      console.error('❌ Error exporting records:', error.response?.data || error.message);
      throw error; 
    }
  }
}