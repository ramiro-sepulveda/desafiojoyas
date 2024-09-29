const databaseError = {
  "22P02": {
    code: 400,
    message: "Invalid params value",
  },
  42703: {
    code: 400,
    message: "Bad request",
  },
  42601: {
    code: 400,
    message: "Bad request",
  },
  
  // puedes agregar más errores a continuación...
  // códigos en: https://www.postgresql.org/docs/current/errcodes-appendix.html
};

export const getDatabaseError = (code) => {
  return databaseError[code] || { code: 500, message: "Internal server error" };
};
