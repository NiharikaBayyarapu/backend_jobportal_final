import errorResponse from '../utils/errorResponse.js';

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // req.user is set by protect middleware
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, no user found' });

      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Rile ${req.user.role} is not authorized to access this resource`,
        })
          
        
      }

      next();
    } catch (err) {
      return res.status(500).json({
        message: 'Serever error during role authorized check',
        

      })
    }
  };
};

export default authorizeRoles;
