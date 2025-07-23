import sql from 'mssql';
import fs from 'fs';
import csv from 'csv-parser';

const BATCH_SIZE = 500;

const getDbPool = async () => {
  if (pool) {
    await pool.close(); // Ensure fresh connection on Azure
    pool = null;
  }

  try {
    const dbConfig = JSON.parse(process.env.DB_CONFIG);
    pool = await sql.connect(dbConfig);
    console.log('✅ DB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    throw err;
  }

  return pool;
};

let pool = null;

export async function uploadCsv(dataType) {
  const filePath = `./${dataType}.csv`;
  const rows = [];

  // ✅ Step 1: Parse CSV before DB connection
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: '\t', mapHeaders: ({ header }) => header.trim(), mapValues: ({ value }) => value.trim() }))
      .on('data', (row) => {
        if (dataType === 'clients') {
          rows.push({
            id: row.id,
            client_name: row.client_name,
            industry: row.industry,
            created_time: new Date(row.created_time),
            modified_time: new Date(row.modified_time)
          });
        } else {
          rows.push({
            id: row.id,
            client_id: row.contact_id,
            client_name: row.client_name,
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            associated_tags: row.associated_tags,
            created_time: new Date(row.created_time),
            modified_time: new Date(row.modified_time)
          });
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📦 Parsed ${rows.length} rows from ${filePath}`);

  // ✅ Step 2: Connect to DB
  try {
    pool = await getDbPool();
  } catch (err) {
    return;
  }

  // ✅ Step 3: Truncate tables
  if (dataType === 'clients') {
    await pool.request().query('TRUNCATE TABLE dbo.clients');
    console.log('🧹 Truncated dbo.clients');
  } else {
    await pool.request().query('TRUNCATE TABLE dbo.contacts');
    console.log('🧹 Truncated dbo.contacts');
  }

    // ✅ Step 4: Batch insert
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    if (dataType === 'clients') {
      const tbl = new sql.Table('dbo.ClientTableType');
      tbl.columns.add('id', sql.NVarChar(255));
      tbl.columns.add('client_name', sql.NVarChar(255));
      tbl.columns.add('industry', sql.NVarChar(255));
      tbl.columns.add('created_time', sql.DateTime2(7));
      tbl.columns.add('modified_time', sql.DateTime2(7));

      for (const r of batch) {
        tbl.rows.add(
          r.id, 
          r.client_name, 
          r.industry === "" ? null : r.industry, 
          r.created_time, 
          r.modified_time);
      }

      try {
        await pool.request()
          .input('Clients', sql.TVP('dbo.ClientTableType'), tbl)
          .execute('dbo.LoadClientsBatch');
        console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1}`);
      } catch (err) {
        console.error(`❌ Error inserting clients batch ${i / BATCH_SIZE + 1}:`, err.message);
      }

    } else { // contacts
      const tbl = new sql.Table('dbo.ContactTableType');
      tbl.columns.add('id', sql.NVarChar(255));
      tbl.columns.add('client_id', sql.NVarChar(255));
      tbl.columns.add('client_name', sql.NVarChar(255));
      tbl.columns.add('first_name', sql.NVarChar(255));
      tbl.columns.add('last_name', sql.NVarChar(255));
      tbl.columns.add('email', sql.NVarChar(255));
      tbl.columns.add('associated_tags', sql.NVarChar(255));
      tbl.columns.add('created_time', sql.DateTime2(7));
      tbl.columns.add('modified_time', sql.DateTime2(7));

      for (const r of batch) {
        tbl.rows.add(
          r.id,
          r.client_id ?? null,
          r.client_name ?? null,
          r.first_name ?? null,
          r.last_name ?? null,
          r.email ?? null,
          r.associated_tags ?? null,
          r.created_time instanceof Date && !isNaN(r.created_time) ? r.created_time : null,
          r.modified_time instanceof Date && !isNaN(r.modified_time) ? r.modified_time : null
        );
      }

      try {
        await pool.request()
          .input('Contacts', sql.TVP('dbo.ContactTableType'), tbl)
          .execute('dbo.LoadContactsBatch');
        console.log(`✅ Inserted batch ${i / BATCH_SIZE + 1}`);
      } catch (err) {
        console.error(`❌ Error inserting contacts batch ${i / BATCH_SIZE + 1}:`, err.message);
      }
    }
  }

  console.log('🎉 Upload complete.');
}
