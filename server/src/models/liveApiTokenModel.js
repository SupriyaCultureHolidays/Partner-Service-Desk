import { getPool } from '../config/db.js';
import sql         from 'mssql';

// Single shared company account — always keep exactly one row (id = 1).
const upsert = async ({ accessToken, refreshToken, expiresAt, updatedBy }) => {
  const pool = await getPool();
  await pool.request()
    .input('access_token',  sql.NVarChar(sql.MAX), accessToken)
    .input('refresh_token', sql.NVarChar(sql.MAX), refreshToken || null)
    .input('expires_at',    sql.DateTime2,         expiresAt || null)
    .input('updated_by',    sql.NVarChar(100),     updatedBy || null)
    .query(`
      MERGE live_api_tokens WITH (HOLDLOCK) AS t
      USING (SELECT 1 AS id) AS s
      ON t.id = s.id
      WHEN MATCHED THEN UPDATE SET
        access_token  = @access_token,
        refresh_token = @refresh_token,
        expires_at    = @expires_at,
        updated_by    = @updated_by,
        updated_at    = SYSUTCDATETIME()
      WHEN NOT MATCHED THEN INSERT (id, access_token, refresh_token, expires_at, updated_by)
        VALUES (1, @access_token, @refresh_token, @expires_at, @updated_by);
    `);
};

const getLatest = async () => {
  const pool   = await getPool();
  const result = await pool.request().query(`SELECT TOP 1 * FROM live_api_tokens WHERE id = 1`);
  return result.recordset[0] || null;
};

export default { upsert, getLatest };
