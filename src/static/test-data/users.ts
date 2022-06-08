import UserRole from '../../model/enum/UserRole';

const users = [
  {
    email: 'anton.s@gmail.com',
    password: 'Qwerty12345!@',
    role: UserRole.Caregiver,
    firstName: 'Anton',
    lastName: 'S',
    country: 'Ukraine',
  },
  {
    email: 'hryhorii.petrenko@nure.ua',
    password: 'iEnjoyMyLife!@',
    role: UserRole.OrganizationAdministrator,
    firstName: 'Hryhorii',
    lastName: 'Petrenko',
    country: 'Ukraine',
  },
  {
    email: 'anton.sirman@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
    firstName: 'Anton',
    lastName: 'Sirman',
    country: 'Ukraine',
  },
  {
    email: 'svitlana.s@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Caregiver,
    firstName: 'Svitlana',
    lastName: 'S',
    country: 'Ukraine',
  },
  {
    email: 'olena.who@gmail.com',
    password: 'iEnjoyMyLife!@',
    role: UserRole.Medic,
    firstName: 'Olena',
    lastName: 'Who',
    country: 'Ukraine',
  },
];
export default users;
