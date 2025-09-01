// utils/errorResponse.js
const errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

export default errorResponse;
