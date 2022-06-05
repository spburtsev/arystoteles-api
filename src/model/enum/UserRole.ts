enum UserRole {
  Seed = 'seed',
  Admin = 'admin',
  OrganizationAdministrator = 'organizationAdministrator',
  Medic = 'medic',
  Caregiver = 'caregiver',
}
export default UserRole;

export const userRoles = [
  UserRole.Seed,
  UserRole.Admin,
  UserRole.OrganizationAdministrator,
  UserRole.Caregiver,
  UserRole.Medic,
];

export const securedRoles = [UserRole.Seed, UserRole.Admin];
