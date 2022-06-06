enum UserRole {
  Seed = 'seed',
  Admin = 'admin',
  OrganizationAdministrator = 'organizationAdministrator',
  Medic = 'medic',
  Caregiver = 'caregiver',
}
export default UserRole;

export const securedRoles = [UserRole.Seed, UserRole.Admin];
