import express from "express";
import db_connection from "./DB/db.connection.js";
import user_controllor from "./modules/User/user.controllor.js";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
const app = express();
app.use(helmet());
app.use(hpp());
app.use(express.json());

const limitter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "try after 5 minute",
});
await db_connection();
app.use("/users/confirm", limitter);
app.use("/users", user_controllor);

app.use((err, req, res, next) => {
  res
    .status(err.cause || 500)
    .json({ message: `something wrong`, err: err.message, stack: err.stack });
});

app.use((req, res) => {
  res.status(404).json({ message: `Page Not Found` });
});

export default app;
