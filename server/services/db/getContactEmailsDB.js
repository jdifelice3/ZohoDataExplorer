import pkg from 'mssql';
const sql = pkg.default || pkg; // covers both default and full export cases

export const getContactEmailsDB = async (clientId) => {
    
    try{
        let pool = await sql.connect(JSON.parse(process.env.DB_CONFIG));
        const SQL = `SELECT email FROM dbo.Contacts WHERE client_id = '${clientId}'`;
        const results = await pool.request().query(SQL);
        const arrContactEmails = results.recordset.map(record => record.email);
        
        return arrContactEmails;
    } catch (err) {
        console.error('SQL error', err);
        
        throw err;            
    } finally {
        await sql.close();
    }   
}