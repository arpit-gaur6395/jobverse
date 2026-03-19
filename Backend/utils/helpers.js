// ========================================
// 🔧 UTILITY FUNCTIONS
// ========================================

/**
 * Standardized error response format
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 */
export const sendError = (res, statusCode, message, details = null) => {
  const errorResponse = {
    success: false,
    message,
    ...(details && { details })
  };
  
  console.error(`Error ${statusCode}: ${message}`, details || '');
  return res.status(statusCode).json(errorResponse);
};

/**
 * Standardized success response format
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  const successResponse = {
    success: true,
    message,
    ...(data && { data })
  };
  
  return res.status(statusCode).json(successResponse);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Array} - Array of error messages
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }
  
  // Check character types
  let charTypeCount = 0;
  if (/[A-Z]/.test(password)) charTypeCount++; // Uppercase
  if (/[a-z]/.test(password)) charTypeCount++; // Lowercase
  if (/\d/.test(password)) charTypeCount++; // Numbers
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charTypeCount++; // Special
  
  if (charTypeCount < 2) {
    errors.push("Password must contain at least 2 of the following: uppercase letters, lowercase letters, numbers, or special characters");
  }
  
  // Check common passwords
  const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123', 'password123', '123456789', 'abc123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common. Please choose a more secure password");
  }
  
  return errors;
};

/**
 * Validate required fields
 * @param {Object} data - Object containing fields to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Array} - Array of missing field names
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      missingFields.push(field);
    }
  }
  
  return missingFields;
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Paginate results
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination object
 */
export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  
  const skip = (parsedPage - 1) * parsedLimit;
  
  return {
    skip,
    limit: parsedLimit,
    page: parsedPage,
    totalPages: Math.ceil(100 / parsedLimit) // This would be calculated based on total count
  };
};

/**
 * Format file upload response
 * @param {Object} file - Multer file object
 * @param {string} baseUrl - Base URL for file access
 * @returns {Object} - Formatted file response
 */
export const formatFileResponse = (file, baseUrl) => {
  if (!file) return null;
  
  return {
    originalname: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    url: `${baseUrl}/uploads/${file.filename}`
  };
};
