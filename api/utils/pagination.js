const pagination = async (params, totalRecords) => {
  const data = {};
  data.currentPage = Number(params.page) || 1; // current page number
  data.limit = Number(params.records) || 50; // record per page
  data.offset = data.limit * data.currentPage - data.limit; // offset per page
  data.totalPages = Math.ceil(totalRecords / data.limit);
  data.from = data.offset + 1; // start record in per page
  data.to = data.limit * data.currentPage; // end record in per page
  if (totalRecords < data.to) {
    data.to = totalRecords; // when total record less than end record
  }
  return data;
};

module.exports = pagination;
