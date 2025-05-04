export class CreateUserDto {
  name: string;
  password: string;
  role: 'admin' | 'poster' | 'saler';
}
export class UpdateUserDto {
  name: string;
  password: string;
  role: 'admin' | 'poster' | 'saler';
}
