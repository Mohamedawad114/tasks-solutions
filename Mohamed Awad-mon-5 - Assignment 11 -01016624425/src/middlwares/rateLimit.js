import rateLimit from "express-rate-limit";


export const limitter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,

});
