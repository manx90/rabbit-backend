const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration - update these values for your cPanel database
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'rabbit_db',
};

async function fixDatabase() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully!');

    // Read the SQL fix script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, '..', 'fix-database.sql'),
      'utf8',
    );

    // Split the script into individual queries
    const queries = sqlScript
      .split(';')
      .map((query) => query.trim())
      .filter((query) => query.length > 0 && !query.startsWith('--'));

    console.log('Executing database fix...');

    for (const query of queries) {
      if (query.trim()) {
        console.log(`Executing: ${query.substring(0, 50)}...`);
        await connection.execute(query);
      }
    }

    console.log('✅ Database fix completed successfully!');
    console.log(
      'The isManualPublishState column has been added to the product table.',
    );
  } catch (error) {
    console.error('❌ Error fixing database:', error.message);

    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  The column already exists. No action needed.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Database access denied. Please check your credentials.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log(
        '❌ Database does not exist. Please check your database name.',
      );
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Check if we have the required environment variables
if (
  !process.env.MYSQL_HOST &&
  !process.env.MYSQL_USER &&
  !process.env.MYSQL_DB
) {
  console.log(`
❌ Missing database configuration!

Please set the following environment variables or update the script:

MYSQL_HOST=your_host
MYSQL_PORT=3306
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DB=your_database_name

Or create a .env file with these values.

Example:
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=rabbit_user
MYSQL_PASSWORD=your_password
MYSQL_DB=rabbit_db
  `);
  process.exit(1);
}

fixDatabase();
