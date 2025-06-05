// import 'reflect-metadata';
// import { DataSource, DataSourceOptions } from 'typeorm';
// import * as path from 'path';
// import * as dotenv from 'dotenv';
// // Load environment variables from project root .env
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
// // Validate required env vars
// const required = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DB'];
// for (const v of required) {
//   if (!process.env[v]) {
//     throw new Error(`Missing environment variable ${v}`);
//   }
// }
// export const dataSourceOptions: DataSourceOptions = {
//   type: 'mysql',
//   host: process.env.MYSQL_HOST as string,
//   port: parseInt(process.env.MYSQL_PORT || '3306', 10),
//   username: process.env.MYSQL_USER as string,
//   password: process.env.MYSQL_PASSWORD as string,
//   database: process.env.MYSQL_DB as string,
//   entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
//   migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
//   synchronize: true,
//   logging: false,
//   migrationsTableName: 'typeorm_migrations',
// };
// const dataSource = new DataSource(dataSourceOptions);
// export default dataSource;
"use strict";

//# sourceMappingURL=data-source.js.map