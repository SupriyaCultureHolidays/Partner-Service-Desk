import 'dotenv/config';
import sql from 'mssql';

const config = {
  user:     process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server:   process.env.SQL_SERVER,
  options:           { encrypt: false, trustServerCertificate: true },
  connectionTimeout: parseInt(process.env.SQL_CONNECT_TIMEOUT) || 30000,
  requestTimeout:    parseInt(process.env.SQL_REQUEST_TIMEOUT) || 90000,
  pool:              { max: 20, min: 2, idleTimeoutMillis: 30000 },
};

let poolPromise = null;

export const getPool = async () => {
  if (!poolPromise) {
    if (!config.server) throw new Error('SQL_SERVER env var is missing — check server/.env');
    poolPromise = (async () => {
      const p = await sql.connect(config);
      await initTables(p);
      return p;
    })();
    // Reset on failure so the next caller retries instead of getting a permanently rejected promise
    poolPromise.catch(() => { poolPromise = null; });
  }
  return poolPromise;
};

const initTables = async (p) => {
  console.log('[DB] Running initTables…');

  // ── Live API auth token cache (single shared company session) ──────────
  // id is a fixed literal (always 1), not an identity — the model MERGEs a
  // singleton row keyed on id = 1, which SQL Server won't allow into an
  // IDENTITY column without IDENTITY_INSERT. Drop and recreate if an older
  // version of this table (created with IDENTITY) is still around.
  await p.request().query(`
    IF EXISTS (SELECT * FROM sysobjects WHERE name='live_api_tokens' AND xtype='U')
       AND COLUMNPROPERTY(OBJECT_ID('live_api_tokens'), 'id', 'IsIdentity') = 1
      DROP TABLE live_api_tokens
  `);

  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='live_api_tokens' AND xtype='U')
    CREATE TABLE live_api_tokens (
      id            INT            NOT NULL PRIMARY KEY,
      access_token  NVARCHAR(MAX)  NOT NULL,
      refresh_token NVARCHAR(MAX)  NULL,
      expires_at    DATETIME2      NULL,
      updated_by    NVARCHAR(100)  NULL,
      updated_at    DATETIME2      NOT NULL DEFAULT GETUTCDATE()
    )
  `);

  console.log('[DB] Tables ready.');
};
