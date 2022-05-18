import UserRole from '../enum/UserRole';

class User {
  id: string;
  email: string;
  password: string;
  role: UserRole;

  constructor(id: string, email: string, password: string, role: UserRole) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  public withoutPassword() {
    const { password, ...user } = this;
    return user;
  }
}
export default User;
