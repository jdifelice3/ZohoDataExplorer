import pkg from 'mssql';
const sql = pkg.default || pkg; // covers both default and full export cases

export const logToDB = async(logData) => {
    try {
        let pool = await sql.connect(JSON.parse(process.env.DB_CONFIG));
        await pool.request()
            .input('Timestamp', sql.DateTime2, new Date())
            .input('UserId', sql.NVarChar, logData.userId || null)
            .input('Source', sql.NVarChar, logData.source)
            .input('Action', sql.NVarChar, logData.action)
            .input('Method', sql.NVarChar, logData.method || null)
            .input('Endpoint', sql.NVarChar, logData.endpoint || null)
            .input('StatusCode', sql.Int, logData.statusCode || null)
            .input('DurationMs', sql.Int, logData.durationMs || null)
            .input('ErrorText', sql.NVarChar, logData.errorText || null)
            .input('Meta', sql.NVarChar, JSON.stringify(logData.meta || {}))
            .query(`
                INSERT INTO log.Logs (Timestamp, UserId, Source, Action, Method, Endpoint, StatusCode, DurationMs, ErrorText, Meta)
                VALUES (@Timestamp, @UserId, @Source, @Action, @Method, @Endpoint, @StatusCode, @DurationMs, @ErrorText, @Meta)
        `);
    } catch (err) {
        console.error('SQL error', err);
        throw err;

    }   finally {
        await sql.close();
    }   
  }
  