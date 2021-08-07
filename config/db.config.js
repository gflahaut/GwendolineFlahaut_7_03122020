const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.DB_LIMIT
});

async function request(sql, data) {
  let connexion;
  try {
    connexion = await pool.getConnection();
    const rows = await connexion.query(sql, data);
    if (rows.meta !== undefined) delete rows.meta;
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (connexion) connexion.release(); 
  }
}

module.exports.request = request;
