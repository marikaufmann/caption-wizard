import { NextFunction, Request, Response } from "express";
import path from "path";
import { format } from "date-fns";
import fs from "fs";
import fsPromises from "fs/promises";
import { v4 as uuid } from "uuid";

export const logEvents = async (logEvent: string, fileName: string) => {
  const dateTime = format(new Date(), "yyyy.MM.dd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${logEvent}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "../logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "../logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "../logs", fileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.path}`);
  next();
};
