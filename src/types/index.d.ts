import UserRole from '../model/enum/UserRole';

export {};
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        role?: UserRole;
      };
    }
  }
}
