import AppLocale from 'src/model/enum/AppLocale';
import UserRole from '../model/enum/UserRole';

export {};
declare global {
  type AnyFn = (...args: any[]) => any;
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        role?: UserRole;
      };
      locale?: AppLocale;
    }
  }
}
