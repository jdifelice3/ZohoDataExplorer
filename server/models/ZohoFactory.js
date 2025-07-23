export class Zoho {
    getMappedRecords() {
      throw new Error("mapRecords() must be implemented");
    }
  
    fetchRecords() {
      throw new Error("fetchRecords() must be implemented");
    }
  }

  export class Client extends Zoho {
    
    getMappedRecords(clients) {
        let mappedClients = [];
        if (clients && clients.length > 0) {
            mappedClients = clients.map(client => ({
              id: client.id,
              client_name: client.Client_Name,
              industry: client.Industry,
              created_time: client.Created_Time,
              modified_time: client.Modified_Time
            }));
            return mappedClients;
        } else {
            throw new Error("No client records found.");
            return null;
        }
    }

  }

  export class Contact extends Zoho {

    getMappedRecords(contacts) {
        let mappedContacts = [];
        try{            
            if (contacts && contacts.length > 0) {
                let contactName = "";
                mappedContacts = contacts.map(function(contact) {
                  if(!contact.Client_Name) {
                    contactName = "";
                  } else {
                    contactName = contact.Client_Name.name;
                  }

                  return {
                      id: contact.id,
                      contact_id: contact.Client_Name ? contact.Client_Name.id :"",
                      client_name: contact.Client_Name ? contact.Client_Name.name : "",
                      first_name: contact.First_Name,
                      last_name: contact.Last_Name,
                      email: contact.Email,
                      associated_tags: "Energy",
                      created_time: contact.Created_Time,
                      modified_time: contact.Modified_Time,
                  };
              });

                return mappedContacts;
            } else {
                throw new Error("No contact records found.");
            }
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
        
    }
  }
  