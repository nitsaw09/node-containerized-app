const filterData = params => {
  const filter = {};
  const filterBy = params.filterBy || "";
  const filterValue = params.filterValue || "";
  if (filterValue) {
    filter[filterBy] = { $regex: filterValue };
  }
  return filter;
};

module.exports = filterData;
