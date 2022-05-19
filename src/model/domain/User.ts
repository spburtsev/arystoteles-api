import { IUser } from '../data/schema/User';
import UserRole from '../enum/UserRole';

class User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;

  public constructor(
    id: string,
    email: string,
    password: string,
    role: UserRole,
    isActive: boolean = true,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
  }

  public static from(user: IUser) {
    return new User(
      user._id,
      user.email,
      user.password,
      user.role,
      user.isActive,
    );
  }

  public withoutPassword() {
    const { password, ...user } = this;
    return user;
  }
}
export default User;
