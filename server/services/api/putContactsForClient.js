import { putContactTag } from '../api/putContactTag.js'

export const putContactsForClient = async (industry, arrEmails) => {
  let response = null;

  try{
    for (let i = 0; i < arrEmails.length; i++) { 
      response = await putContactTag(arrEmails[i], industry); //client.industry maps to contact.tag 
    }
  } catch (err) {
    let errMessage = `Error putting conact tag in Zoho Zoho Recruit:, ${err}`;
    console.error(errMessage);
    throw new Error(errMessage);  
  }

  return response.status === 200 ? true : false; //return true if successful, false if not
}
  