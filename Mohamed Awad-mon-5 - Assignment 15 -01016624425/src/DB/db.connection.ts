import mongoose from 'mongoose'
import dotenv from "dotenv";
import { logger } from '../middlwares';
dotenv.config({ path: "./dev.env" });
const db_url=process.env.DB_URL

const db_connection=async () => {
try {
  await mongoose.connect(db_url as string);
  logger.info('Connection has been established successfully.');
} catch (error) {
  logger.error('Unable to connect to the database:');
}}


export default db_connection;