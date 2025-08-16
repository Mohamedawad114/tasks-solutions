import joi from "joi";

function validateUser(obj) {
  const schema = joi.object({
    firstName: joi.string().required().trim().min(6).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 6 characters",
      "any.required": "First name is required",
    }),
    lastName: joi.string().required().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
      "any.required": "Last name is required",
    }),
    email: joi.string().email().required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .required()
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
    isAdmin: joi.boolean().default(false),
    gender: joi.string().valid("male", "female"),
    age: joi.number().required().min(16).max(100).messages({
      "number.base": "Age must be a number",
      "number.min": "Age must be at least 18",
      "number.max": "Age must be less than or equal to 100",
      "any.required": "Age is required",
    }),
  });

  return schema.validate(obj);
}
function validateupdateUser(obj) {
  const schema = joi.object({
    firstName: joi.string().trim().min(6).messages({
      "string.base": "First name must be a string",
      "string.min": "First name should be at least 6 characters",
      "any.required": "First name is required",
    }),
    lastName: joi.string().trim().min(4).messages({
      "string.base": "Last name must be a string",
      "string.min": "Last name should be at least 4 characters",
      "any.required": "Last name is required",
    }),
    email: joi.string().email().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    phone: joi
      .string()
      .max(11)
      .regex(/^01[0|1|2|5]\d{8}$/)
      .messages({
        "any.required": "phone is required",
        "string.pattern.base": "Invalid phone number",
      }),
  });

  return schema.validate(obj);
}
function validateUserLogin(obj) {
  const schema = joi.object({
    email: joi.string().email().required().trim().lowercase().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate(obj);
}
function validatePassword(password) {
  const schema = joi.object({
    password: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
  });

  return schema.validate({ password }, { abortEarly: false });
}

function validateupdatePassword(obj) {
  const schema = joi.object({
    oldPassword: joi.string().min(6).required().messages({
      "string.min": "Password should be at least 6 characters",
      "any.required": "Password is required",
    }),
    newPassword: joi
      .string()
      .min(6)
      .invalid(joi.ref("oldPassword"))
      .required()
      .messages({
        "string.min": "Password should be at least 6 characters",
        "any.required": "Password is required",
        "any.invalid": "shouldn't match old password",
      }),
  });

  return schema.validate(obj);
}

export {
  validateUser,
  validateupdateUser,
  validateUserLogin,
  validateupdatePassword,
  validatePassword,
};
