module.exports = (objPagination, query, coutRecords) => {
  // Hỗ trợ cả limit và limitItem từ query
  if (query.page) {
    objPagination.currentPage = parseInt(query.page);
  }
  if (query.limitItem) {
    objPagination.limitItem = parseInt(query.limitItem);
  } else if (query.limit) {
    objPagination.limitItem = parseInt(query.limit);
  }
  objPagination.skip =
    (objPagination.currentPage - 1) * objPagination.limitItem;

  objPagination.totalPage = Math.ceil(coutRecords / objPagination.limitItem);
  return objPagination;
};
