import { RequestHandler, Response } from "express";
import pino from "pino";
import { pinoHttp } from "pino-http";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "HH:MM:ss" },
  },
});


export const httpLogger = pinoHttp({
  logger,
  autoLogging: true,
  customLogLevel: (res:Response, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
})as unknown as RequestHandler;