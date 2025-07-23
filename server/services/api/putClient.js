import { getAccessToken } from '../auth/authService.js';
import { putContactsForClientDB, putClientDB } from '../db/clientDataService.js';
import { getContactEmailsDB } from '../db/getContactEmailsDB.js';
import { putContactsForClient } from './putContactsForClient.js';
import { ROUTES } from '../../config/api.js'; 

export async function putClient(clientId, industry) {
  let accessToken = null;
  let arrEmails = null;
  let endpoint = null;
  let jsonBody = {
    "data": [
      {
        "Industry": industry
      }
    ]
  };

  //Step 1: Get the contact emails for the client from the database.
  try {
      arrEmails = await getContactEmailsDB(clientId);
      console.log(`Successfully retrieved contact emails from the database for clientId ${clientId}:`);
  } catch (err) { 
      let errMessage = `Error updating client industry in the database:, ${err}`;
      console.error(errMessage);
      throw new Error(errMessage);  
  }

  //Step 2: Get the Zoho access token with the appropriate scope.
  try {
    accessToken = await getAccessToken(process.env.ZOHO_RECRUIT_CLIENT_ALL_REFRESH_TOKEN);
  } catch (err) {
     let errMessage = `Error getting access token from Zoho Recruit:, ${err}`;
    console.error(errMessage);
    throw new Error(errMessage);  
  }

  // Step 3: Update client industry in Zoho Recruit.
  try {
    endpoint = `${ROUTES.PUT_CLIENT}/${clientId}`;
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Zoho-oauthtoken ' + accessToken },
      body: JSON.stringify(jsonBody),
    });
    const results = await res.json();
    console.log(`Successfully updated client industry in Zoho Recruit: ${results}`);
    if (res.status !== 200) {
      let errMessage = `Error updating client industry in Zoho Recruit: ${results}`;
      console.error(errMessage);
      throw new Error(errMessage);  
    }
  } catch (err) { 
    let errMessage = `'Error updating client industry in the database:', ${err}`;
    console.error( errMessage);
    throw new Error(errMessage);
  } 

  // Step 4: Update client industry in the database.
  try {
    let success = await putClientDB(clientId, industry);
    if (!success) {
      let errMessage = `Error updating client industry in the database:, ${err}`;
      console.error(errMessage);
      throw new Error(errMessage);  
    }
    console.log('Successfully updated local database with new industry value');
  } catch (err) { 
    let errMessage = `Error updating client industry in the database:, ${err}`;
    console.error(errMessage);
    throw new Error(errMessage);  
  }

  // Step 5: Set the associated tags in all client contacts to the new industry value.
  try {
    let response;
    response = await putContactsForClient(industry, arrEmails); //client.industry maps to contact.tag
    if (!response) {
      let errMessage = `Error putting contact tag in Zoho Recruit:, ${err}`;
      console.error(errMessage);
      throw new Error(errMessage);  
    }
    console.log('Successfully updated contact tags in Zoho Recruit');
  } catch (err) {
    let errMessage = `Error putting contact tag in Zoho Recruit:, ${err}`;  
    console.error(errMessage);
    throw new Error(errMessage);  
  }           

  //Step 6: Update database contact tags with the new industry value.
  try{
    let success = await putContactsForClientDB(clientId, industry);
    if (!success) {
      let errMessage = `Error updating contact tags in the database:, ${err}`
      console.error(errMessage);
      throw new Error(errMessage);
    }
    console.log('Successfully updated local database with new industry value');
  } catch (err) { 
    let errMessage = `Error updating contact tags in the database:, ${err}`;
    console.error(errMessage);
    throw new Error(errMessage);
  }
  console.log('Successfully updated client industry and contact tags');
    return true;
}