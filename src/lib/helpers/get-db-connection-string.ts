const getDbConnectionString = () =>
  String(process.env.DB).replace(
    '<password>',
    encodeURIComponent(process.env.DB_PSW),
  );
export default getDbConnectionString;
