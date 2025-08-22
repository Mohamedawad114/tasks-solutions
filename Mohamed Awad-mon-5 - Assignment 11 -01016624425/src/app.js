import express from 'express'
import helmet from 'helmet';
import env from'dotenv'
import Cron from 'node-cron';
import hpp from'hpp'
import user_controllor from './modules/Users/user.controllors.js'
import db_connection from './DB/db.connection.js';
import deleteAll_EXTokens from './utils/cron-job.js';

const app = express();
app.use(helmet());
env.config();
app.use(hpp());
app.use(express.json());
app.use('/users',user_controllor)

 await db_connection()

Cron.schedule('0 0 * * *',deleteAll_EXTokens)

app.use((err, req, res, next) => {
  res.status(err.cause||500).json({message:`something wrong`,err:err.message,stack:err.stack});
});

app.use((req, res) => {
  res.status(404).json({message:`Page Not Found`});
});

export default app;
