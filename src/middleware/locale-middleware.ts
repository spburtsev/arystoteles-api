import { Request, Response, NextFunction } from 'express';
import AppLocale from '../model/enum/AppLocale';

const matchLocale = (headerValue?: string) => {
  const locale = headerValue?.split(',')[0];
  if (locale === 'uk') {
    return AppLocale.Ukrainian;
  }
  return AppLocale.English;
};

const localeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const matchedLocale = matchLocale(req.headers['accept-language']);
  req.locale = matchedLocale;
  res.locals.locale = matchedLocale;
  next();
};
export default localeMiddleware;
