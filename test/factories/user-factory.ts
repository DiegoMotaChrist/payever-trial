import {
  UserEntity,
  UserEntityProps,
} from '../../src/app/entities/user.entity';

type Override = Partial<UserEntityProps>;

export function makeUser(override: Override = {}) {
  return new UserEntity({
    job: 'developer',
    name: 'diego',
    ...override,
  });
}
