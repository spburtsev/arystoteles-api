const dbConnectionString = process.env.DB.replace(
  '<password>',
  encodeURIComponent(process.env.DB_PSW),
);
export default dbConnectionString;
