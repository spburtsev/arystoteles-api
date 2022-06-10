import { Request, Response, NextFunction } from 'express';
import AppLocale from '../model/enum/AppLocale';

const matchLocale = (headerValue: string) => {
  const locale = headerValue.split(',')[0];
  if (locale === 'uk') {
    return AppLocale.Ukrainian;
  }
  return AppLocale.English;
};

const localeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const acceptedLanguage = req.headers['accept-language'];
  const matchedLocale = matchLocale(acceptedLanguage);
  req.locale = matchedLocale;
  res.locals.locale = matchedLocale;
  next();
};
export default localeMiddleware;
