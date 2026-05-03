const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    totalPages,
    hasNext,
    hasPrev,
    totalItems: total,
    limit,
  };
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

module.exports = {
  generatePagination,
  sanitizeUser,
};