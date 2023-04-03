import { randomUUID } from 'crypto';

export interface UserAvatarProps {
  userId: number;
  hash: string;
  content: {
    name: string;
    mimeType: string;
    size: number;
  };
}

export class UserAvatarEntity {
  private _id: string | undefined;
  private props: UserAvatarProps;

  constructor(props: UserAvatarProps, id?: string) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
    };
  }

  public get id(): string | undefined {
    return this._id;
  }

  public set userId(userId: number) {
    this.props.userId = userId;
  }

  public get userId(): number {
    return this.props.userId;
  }

  public set hash(hash: string) {
    this.props.hash = hash;
  }

  public get hash(): string {
    return this.props.hash;
  }

  public get content(): any {
    return this.props.content;
  }

  public set content(data: any) {
    this.props.content = data;
  }
}
