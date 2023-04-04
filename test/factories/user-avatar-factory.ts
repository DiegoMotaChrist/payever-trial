import {
  UserAvatarEntity,
  UserAvatarProps,
} from '../../src/app/entities/user-avatar.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

type Override = Partial<UserAvatarProps>;

export async function makeUserAvatar(override: Override = {}) {
  return new UserAvatarEntity({
    userId: 2,
    hash: await bcrypt.hash(randomBytes(20).toString('hex'), 10),
    content: {
      mimeType: 'image/jpg',
      name: 'any',
      size: 100,
    },
    ...override,
  });
}
