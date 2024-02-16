import { ErrorWithCode } from "@/utilities/customErrors/ErrorWithCode";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: string | Error | ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = err instanceof Error ? err.message : err;
  const code = err instanceof ErrorWithCode ? err.code : 400;
  res.status(code).send(`it's broken: ${message}`);
  next();
};

export default errorHandler;
