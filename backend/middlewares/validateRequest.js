import Joi from 'joi';

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ success: false, errors });
  }

  next();
};

export default validateRequest;
