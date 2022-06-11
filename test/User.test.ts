import User from '../src/model/data/schema/User';
import UserRole from '../src/model/enum/UserRole';

describe('Verify User schema functionality', () => {
  const usr = new User({
    email: 'anton.kukich@gmai.com',
    password: '123123!dsA',
    firstName: 'Anton',
    lastName: 'Kukich',
    role: UserRole.Caregiver,
  });

  test('Password protection #1', () => {
    const securedUsr = usr.secured() as any;
    expect(securedUsr.password).toBe(undefined);
    expect(securedUsr.firstName).toBeDefined();
  });
  test('Password protection #2', () => {
    expect(usr.password).toBeDefined();
  });
  test('Password protection #3', async () => {
    expect(await usr.comparePasswords('123123!dsA', usr.password)).toBeFalsy();
    expect(await usr.comparePasswords('123123!dsA', '123123!dsA')).toBeFalsy();
  });
});
