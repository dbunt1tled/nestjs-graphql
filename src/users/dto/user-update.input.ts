import { UserStatus } from 'src/users/enum/user.status';

export interface UserUpdateInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  status?: UserStatus;
}
