enum UserRole {
  Seed = 'seed',
  Admin = 'admin',
  OrganizationAdmin = 'admin',
  Medic = 'medic',
  Parent = 'parent',
}
export default UserRole;

export const userRoles = [
  UserRole.Seed,
  UserRole.Admin,
  UserRole.OrganizationAdmin,
  UserRole.Parent,
  UserRole.Medic,
];
