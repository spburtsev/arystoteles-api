enum UserRole {
  Seed = 'seed',
  Admin = 'admin',
  OrganizationAdministrator = 'organizationAdministrator',
  Medic = 'medic',
  Parent = 'parent',
}
export default UserRole;

export const userRoles = [
  UserRole.Seed,
  UserRole.Admin,
  UserRole.OrganizationAdministrator,
  UserRole.Parent,
  UserRole.Medic,
];

export const securedRoles = [UserRole.Seed, UserRole.Admin];
