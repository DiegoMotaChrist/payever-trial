export class UserAvatarModel {
  static toHTTP({ file, base64 }) {
    return file
      ? {
          file: {
            id: file.id,
            userId: file.user_id,
            hash: file.hash,
            content: file.content,
          },
          base64,
        }
      : { base64 };
  }
}
