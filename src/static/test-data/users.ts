import UserRole from '../../model/enum/UserRole';

const users = [
  {
    email: 'anton.s@gmail.com',
    password: 'Qwerty12345!@',
    role: UserRole.Caregiver,
  },
  {
    email: 'hryhorii.petrenko@nure.ua',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Medic,
  },
  {
    email: 'anton.sirman@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
  },
  {
    email: 'svitlana.s@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
  },
  {
    email: 'olena.who@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Medic,
  },
];
export default users;
