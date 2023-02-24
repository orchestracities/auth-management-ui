export const getRowsPerPage = (env) => {
  return typeof env === 'undefined' ? 10 : Number(env.TABLE_DEFAULT_DATA_AMOUNT);
};

export const getTableMax = (env) => {
  return Math.max(...(typeof env === 'undefined' ? [10, 25, 50] : JSON.parse(env.TABLE_PAGINATION_OPTIONS)));
};

export const getTablePageOptions = (env) => {
  return typeof env === 'undefined' ? [10, 25, 50] : JSON.parse(env.TABLE_PAGINATION_OPTIONS);
};
