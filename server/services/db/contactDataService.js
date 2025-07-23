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

export async function getData(request, resultsCallback) {
    try {
        const SQL = buildSql(request);
        const pool = await getDbPool();
        const result = await pool.request().query(SQL);
        let rowCount = 0;
        if (result.recordset.length > 0) {
            rowCount = result.recordset[0].TotalRows;
        }
        
        resultsCallback(result.recordset, rowCount);
    } catch (err) {
        console.error('SQL error', err);
        resultsCallback([], 0); 
    }
}

function buildSql(request) {
    const selectSql = createSelectSql(request);
    const fromSql = createFromSql(request);
    const whereSql = createWhereSql(request);
    const groupBySql = createGroupBySql(request);
    const orderBySql = createOrderBySql(request);
    const paginationSql = createPaginationSql(request);

    const sql = selectSql + fromSql + whereSql + groupBySql + orderBySql + paginationSql;
    console.log(sql);
    
    return sql;
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
    return "SELECT id, First_Name AS 'First Name', Last_Name AS 'Last Name', Client_Name AS 'Client Name', Email AS 'Email', Associated_Tags AS 'Associated Tags', COUNT(*) OVER() AS 'TotalRows' "; 
}

function createFromSql(request) { 
    return ' FROM dbo.Contacts ';
}

function createWhereSql(request) {
    let whereClause = ' WHERE 1=1 ';

    if(typeof request.clientId !== 'undefined'){
        whereClause += " AND client_id = '" + request.clientId + "' ";
        console.log("Generated whereClause:", whereClause);
        return whereClause;

    }
    const rules = request.queryBuilderFilter.rules;
    const combinator = request. queryBuilderFilter.combinator || 'AND';
    
    if(request.queryBuilderFilter.rules.length > 0){
        for(let i = 0; i < rules.length; i++){
            const rule = rules[i];

            switch(rule.operator){
                case 'contains':
                    whereClause += ` ${combinator} ${rule.field} LIKE '%${rule.value}%' `;
                    break;
                case '=': case '!=':
                    whereClause += ` ${combinator} ${rule.field} ${rule.operator} '${rule.value}' `;
                    break;
                case 'is null': case 'is not null':
                    whereClause += ` ${combinator} ${rule.field} ${rule.operator} `;
                    break;
                default:
                    break; 
            }
        }
    }
   
    return whereClause; 
}
function createGroupBySql(request) { return ' '; }
function createOrderBySql(request) { return ' ORDER BY client_name '; } 
