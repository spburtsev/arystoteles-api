const getDbConnectionString = () =>
  String(process.env.DB).replace(
    '<password>',
    encodeURIComponent(process.env.DB_PSW),
  );
export default getDbConnectionString;

export const getDbUri = () => {
  return String(process.env.DB_URI).replace(
    '<password>',
    encodeURIComponent(process.env.DB_PSW),
  );
};
