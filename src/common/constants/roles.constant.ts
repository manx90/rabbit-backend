export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Salesman = 'Salesman',
  GUEST = 'GUEST',
}

export const ROLES_HIERARCHY = {
  [Role.SuperAdmin]: [Role.SuperAdmin, Role.Admin, Role.Salesman, Role.GUEST],
  [Role.Admin]: [Role.Admin, Role.Salesman, Role.GUEST],
  [Role.Salesman]: [Role.Salesman, Role.GUEST],
  [Role.GUEST]: [Role.GUEST],
};
