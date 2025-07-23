import sql from 'mssql';

let pool = null;

export const getDbPool = async () => {
  if (!pool || !pool.connected) {
    try {
      pool = await sql.connect(JSON.parse(process.env.DB_CONFIG));
      console.log('✅ DB connected');
    } catch (err) {
      console.error('❌ DB connection failed:', err);
      pool = null; // Ensure a new attempt next time
      throw err;
    }
  }
  return pool;
};

export async function putClientDB(id, industry) {
    try {

        const pool = await getDbPool();
        const SQL = `UPDATE dbo.Clients SET Industry = '${industry}' WHERE id = '${id}'`;
        const results = await pool.request().query(SQL);

        return true;
    } catch (err) {
        console.error('SQL error', err);
        return false;
    }
}

export async function getLogData(request, resultsCallback) {
    try {
        const pool = await getDbPool();
        const SQL = buildSql(request);

        const results = await pool.request().query(SQL);

        let rowCount = 0;
        if (results.recordset.length > 0) {
            rowCount = results.recordset[0].TotalRows;
        }

        resultsCallback(results.recordset, rowCount);
        
    } catch (err) {
        console.error('SQL error', err);
        resultsCallback([], 0); 
    }
}
export const putContactsForClientDB = async (clientId, industry) => {
    try{
        const pool = await getDbPool();
        const SQL = `UPDATE dbo.Contacts SET associated_tags = '${industry}' WHERE client_id = '${clientId}'`;

        await pool.request()
            .input('clientId', sql.VarChar, clientId)
            .input('industry', sql.VarChar, industry)
            .query(`UPDATE dbo.Contacts SET associated_tags = '${industry}' WHERE client_id = '${clientId}`);

        return true;
    } catch (err) {
        console.error('SQL error', err);
        return false;   
    } 
}

function buildSql(request) {
    const selectSql = createSelectSql(request);
    const fromSql = createFromSql(request);
    const whereSql = createWhereSql(request);
    const groupBySql = createGroupBySql(request);
    const orderBySql = createOrderBySql(request);
    const paginationSql = createPaginationSql(request);

    return selectSql + fromSql + whereSql + groupBySql + orderBySql + paginationSql;
}

function createPaginationSql(request) {
    const pageSize = request.pageSize || 100;
    const page = request.startRow ? Math.floor(request.startRow / pageSize) : 0;
    const offset = page * pageSize;

    return ` OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`;
}

function cutResultsToPageSize(request, results) {
    const start = request.startRow || 0;
    const end = request.endRow || results.length;
    return results.slice(start, end);
}

function createSelectSql(request) {
    return "SELECT DISTINCT id,Timestamp,UserId,Source,Action,Method,Endpoint,StatusCode,DurationMs,ErrorText,Meta, COUNT(*) OVER() AS 'TotalRows' ";
}

function createFromSql(request) { 
    return " FROM log.Logs ";
}

function createWhereSql(request) {
    let whereClause = ' WHERE 1=1 ';
    const rules = request.queryBuilderFilter.rules;
    const combinator = request.queryBuilderFilter.combinator || 'and';
    
    if(request.queryBuilderFilter.rules.length > 0){

        whereClause += request.queryBuilderFilter.combinator == 'or' ? ' and ( ' : ' and '; 

        for(let i = 0; i < rules.length; i++){
            const rule = rules[i];

            whereClause += i > 0 ? ' ' + combinator + ' ' : ' ';

            switch(rule.operator){
                case 'contains':
                    whereClause += ` ${rule.field} LIKE '%${rule.value}%' `;
                    break;
                case '=': case '!=':
                    whereClause += ` ${rule.field} ${rule.operator} '${rule.value}' `;
                    break;
                case 'is null': case 'is not null':
                    whereClause += ` ${rule.field} ${rule.operator} `;
                    break;
                case '>': case '<':
                        whereClause += ` ${rule.field} ${rule.operator} ${rule.value}`;
                    break;
                default:
                    break; 
            }
        }
        whereClause += request.queryBuilderFilter.combinator == 'or' ? ' ) ' : '  '; 
    }
   
    return whereClause; 
}
function createGroupBySql(request) { return ' '; }
function createOrderBySql(request) { return ' ORDER BY Timestamp DESC '; } 
