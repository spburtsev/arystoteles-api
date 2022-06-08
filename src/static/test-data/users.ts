import UserRole from '../../model/enum/UserRole';

const users = [
  {
    email: 'anton.s@gmail.com',
    password: 'Qwerty12345!@',
    role: UserRole.Caregiver,
    firstName: 'Anton',
    lastName: 'S',
  },
  {
    email: 'hryhorii.petrenko@nure.ua',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Medic,
    firstName: 'Hryhorii',
    lastName: 'Petrenko',
  },
  {
    email: 'anton.sirman@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
    firstName: 'Anton',
    lastName: 'Sirman',
  },
  {
    email: 'svitlana.s@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
    firstName: 'Svitlana',
    lastName: 'S',
  },
  {
    email: 'olena.who@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Medic,
    firstName: 'Olena',
    lastName: 'Who',
  },
];
export default users;
