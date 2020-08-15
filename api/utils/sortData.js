const sortData = params => {
  const sortColumn = {};
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";
  sortColumn[sortBy] = sortOrder;
  return sortColumn;
};

module.exports = sortData;
