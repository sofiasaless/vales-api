import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";

export const validationMiddleware = (dtoClass: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const output = plainToInstance(dtoClass, req.body);

    validate(output, {
      whitelist: true,
      forbidNonWhitelisted: true,
    }).then((errors) => {
      if (errors.length > 0) {
        res.status(400).json(errors);
      } else {
        req.body = output;
        next();
      }
    });
  };
};
