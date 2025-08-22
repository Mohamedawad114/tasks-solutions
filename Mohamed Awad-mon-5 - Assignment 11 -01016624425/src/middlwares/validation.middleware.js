
const Keys = ["body", "query", "params"];
export const validate = (Schema) => {
  return (req, res, next) => {
    let validationErr = [];
    for (const key of Keys) {
      if (Schema[key]) {
        const { error } = Schema[key].validate(req[key], { abortEarly: false });
        if (error) {
          validationErr.push(...error.details);
        }
      }
    }
    if (validationErr.length) {
     return res.status(400).json({
        message: "Validation error",
        errors: validationErr,
      });
    }
    next();
  };
};




